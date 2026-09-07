import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Client } from 'pg';

interface QueryResult {
  columns: string[];
  rows: any[][];
  rowCount: number;
  executionTimeMs: number;
}

interface QueryError {
  code: string;
  message: string;
  hint?: string;
  line?: number;
  position?: number;
}

// Forbidden SQL keywords
const FORBIDDEN_KEYWORDS = [
  'DROP DATABASE',
  'DROP SCHEMA',
  'ALTER SYSTEM',
  'COPY TO',
  'COPY FROM',
  'CREATE EXTENSION',
  'CREATE USER',
  'DROP USER',
  'GRANT',
  'REVOKE',
];

@Injectable()
export class SqlService {
  constructor(private prisma: PrismaService) {}

  async executeQuery(
    datasetId: string,
    query: string,
    userId: string,
  ): Promise<{ success: true; data: QueryResult } | { success: false; error: QueryError }> {
    // Validate query
    const validationError = this.validateQuery(query);
    if (validationError) {
      return { success: false, error: validationError };
    }

    // Get dataset info
    const dataset = await this.prisma.dataset.findUnique({
      where: { id: datasetId },
      include: { tables: true },
    });

    if (!dataset) {
      return {
        success: false,
        error: {
          code: 'DATASET_NOT_FOUND',
          message: 'The specified dataset does not exist.',
        },
      };
    }

    const startTime = Date.now();

    try {
      // Create a connection to execute the query
      // In production, this would connect to a sandboxed database
      const result = await this.executeInSandbox(datasetId, query);

      const executionTimeMs = Date.now() - startTime;

      // Record query history
      await this.prisma.queryHistory.create({
        data: {
          userId,
          datasetId,
          query,
          result: { columns: result.columns, rows: result.rows.slice(0, 10) },
          isSuccess: true,
          rowsReturned: result.rowCount,
          executionTime: executionTimeMs,
        },
      });

      // Update user stats
      await this.prisma.userStats.update({
        where: { userId },
        data: { queriesRun: { increment: 1 } },
      });

      return {
        success: true,
        data: {
          ...result,
          executionTimeMs,
        },
      };
    } catch (error: any) {
      const executionTimeMs = Date.now() - startTime;
      const interpretedError = this.interpretError(error, dataset.tables);

      // Record failed query
      await this.prisma.queryHistory.create({
        data: {
          userId,
          datasetId,
          query,
          isSuccess: false,
          errorCode: interpretedError.code,
          errorMessage: interpretedError.message,
          executionTime: executionTimeMs,
        },
      });

      return {
        success: false,
        error: interpretedError,
      };
    }
  }

  private validateQuery(query: string): QueryError | null {
    const upperQuery = query.toUpperCase().trim();

    // Check for forbidden keywords
    for (const keyword of FORBIDDEN_KEYWORDS) {
      if (upperQuery.includes(keyword)) {
        return {
          code: 'SQL_FORBIDDEN',
          message: The operation "" is not allowed in this environment.,
          hint: 'This SQL playground only supports SELECT queries and limited data modification.',
        };
      }
    }

    // Check query length
    if (query.length > 10000) {
      return {
        code: 'QUERY_TOO_LONG',
        message: 'Your query is too long. Maximum length is 10,000 characters.',
      };
    }

    return null;
  }

  private async executeInSandbox(datasetId: string, query: string): Promise<QueryResult> {
    // For development, we'll execute against the main database with a schema prefix
    // In production, this would connect to an isolated sandbox database

    const client = new Client({
      connectionString: process.env.DATABASE_URL,
    });

    try {
      await client.connect();

      // Set timeout (5 seconds)
      await client.query('SET statement_timeout = 5000');

      // Set search path to the dataset schema
      await client.query(SET search_path TO dataset_, public);

      const result = await client.query(query);

      const columns = result.fields.map((f) => f.name);
      const rows = result.rows.map((row) => columns.map((col) => row[col]));

      return {
        columns,
        rows,
        rowCount: result.rowCount || 0,
        executionTimeMs: 0,
      };
    } finally {
      await client.end();
    }
  }

  private interpretError(error: any, tables: any[]): QueryError {
    const message = error.message || 'An error occurred while executing your query.';

    // Syntax error
    if (message.includes('syntax error')) {
      const match = message.match(/at or near "([^"]+)"/);
      const near = match ? match[1] : '';

      return {
        code: 'SQL_SYNTAX_ERROR',
        message: Your query contains a syntax error near "".,
        hint: this.getSyntaxHint(near, message),
        position: error.position,
      };
    }

    // Table not found
    if (message.includes('relation') && message.includes('does not exist')) {
      const match = message.match(/relation "([^"]+)" does not exist/);
      const tableName = match ? match[1] : 'unknown';
      const availableTables = tables.map((t) => t.name).join(', ');

      return {
        code: 'SQL_TABLE_NOT_FOUND',
        message: The table "" doesn't exist in this database.,
        hint: Available tables: ,
      };
    }

    // Column not found
    if (message.includes('column') && message.includes('does not exist')) {
      const match = message.match(/column "([^"]+)" does not exist/);
      const columnName = match ? match[1] : 'unknown';

      return {
        code: 'SQL_COLUMN_NOT_FOUND',
        message: Column "" doesn't exist in this table.,
        hint: 'Check the table schema to see available columns.',
      };
    }

    // Timeout
    if (message.includes('timeout') || message.includes('canceling statement')) {
      return {
        code: 'SQL_TIMEOUT',
        message: 'Your query took too long to execute.',
        hint: 'Try simplifying your query or adding more specific conditions.',
      };
    }

    // Generic error
    return {
      code: 'SQL_ERROR',
      message: this.cleanErrorMessage(message),
      hint: 'Check your query syntax and try again.',
    };
  }

  private getSyntaxHint(near: string, message: string): string {
    // Common typos
    const typos: Record<string, string> = {
      FORM: 'FROM',
      SELEC: 'SELECT',
      SELCET: 'SELECT',
      WHER: 'WHERE',
      WERE: 'WHERE',
      FORM: 'FROM',
      FORM: 'FROM',
      ORDRE: 'ORDER',
      GROPU: 'GROUP',
      GROP: 'GROUP',
    };

    if (typos[near]) {
      return Did you mean "" instead of ""?;
    }

    if (message.includes('at end of input')) {
      return 'Your query seems incomplete. Make sure all statements are properly closed.';
    }

    return 'Check the SQL syntax around that area.';
  }

  private cleanErrorMessage(message: string): string {
    // Remove internal details
    return message
      .replace(/LINE \d+: /, '')
      .replace(/ERROR: /, '')
      .replace(/DETAIL: /, '')
      .trim();
  }

  async getDatabases() {
    return this.prisma.dataset.findMany({
      where: { isActive: true },
      orderBy: { orderIndex: 'asc' },
      include: {
        _count: { select: { tables: true } },
      },
    });
  }

  async getDatabaseSchema(datasetId: string) {
    const dataset = await this.prisma.dataset.findUnique({
      where: { id: datasetId },
      include: {
        tables: {
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    if (!dataset) {
      return null;
    }

    return dataset;
  }

  async getQueryHistory(userId: string, limit: number = 20, offset: number = 0) {
    const [history, total] = await Promise.all([
      this.prisma.queryHistory.findMany({
        where: { userId },
        orderBy: { executedAt: 'desc' },
        take: limit,
        skip: offset,
        include: {
          dataset: {
            select: { id: true, name: true },
          },
        },
      }),
      this.prisma.queryHistory.count({ where: { userId } }),
    ]);

    return {
      history,
      total,
      hasMore: total > offset + limit,
    };
  }

  async saveQuery(
    userId: string,
    title: string,
    query: string,
    datasetId?: string,
    description?: string,
  ) {
    return this.prisma.savedQuery.create({
      data: {
        userId,
        title,
        query,
        datasetId,
        description,
      },
    });
  }

  async getSavedQueries(userId: string) {
    return this.prisma.savedQuery.findMany({
      where: { userId },
      orderBy: [{ isFavorite: 'desc' }, { createdAt: 'desc' }],
      include: {
        dataset: {
          select: { id: true, name: true },
        },
      },
    });
  }

  async deleteSavedQuery(userId: string, queryId: string) {
    const savedQuery = await this.prisma.savedQuery.findUnique({
      where: { id: queryId },
    });

    if (!savedQuery || savedQuery.userId !== userId) {
      return false;
    }

    await this.prisma.savedQuery.delete({
      where: { id: queryId },
    });

    return true;
  }
}
