export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  ssl?: boolean;
}

const DEFAULT_CONFIG: DatabaseConfig = {
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'Sds@123456',
  database: 'postgres',
};

export const loadDatabaseConfig = (
  env: NodeJS.ProcessEnv = process.env
): DatabaseConfig => {
  return {
    host: env.DATABASE_HOST ?? DEFAULT_CONFIG.host,
    port: Number(env.DATABASE_PORT ?? DEFAULT_CONFIG.port),
    user: env.DATABASE_USER ?? DEFAULT_CONFIG.user,
    password: env.DATABASE_PASSWORD ?? DEFAULT_CONFIG.password,
    database: env.DATABASE_NAME ?? DEFAULT_CONFIG.database,
    ssl:
      env.DATABASE_SSL === 'true'
        ? true
        : env.DATABASE_SSL === 'false'
          ? false
          : DEFAULT_CONFIG.ssl,
  };
};
