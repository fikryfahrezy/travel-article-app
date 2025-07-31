const EnvironmentVariables = {
  DATABASE_HOST: "",
  DATABASE_PORT: 0,
  DATABASE_USERNAME: "",
  DATABASE_PASSWORD: "",
  DATABASE_DBNAME: "",
  JWT_SECRET: "",
  JWT_ISSUER: "",
  TOKEN_COOKIE_DOMAIN: "",
};

export type EnvironmentVariables = {
  env: typeof EnvironmentVariables;
};

export function validateEnv(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const errors: string[] = [];
  const env: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(EnvironmentVariables)) {
    if (!config[key]) {
      errors.push(`Environment variable ${key}`);
    } else {
      const configValue = config[key];
      switch (typeof value) {
        case "string":
          env[key] = configValue;
          break;
        case "number":
          env[key] = Number(configValue);
          break;
        case "boolean":
          env[key] = configValue === "true";
          break;
      }
    }
  }

  if (errors.length !== 0) {
    throw new Error(errors.join(", "));
  }

  return { env: env as EnvironmentVariables["env"] };
}
