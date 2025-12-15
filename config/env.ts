// config/env.ts
export type EnvironmentConfig = {
  readonly developer: {
    readonly name: string;
    readonly url: string;
  };
};

function getEnv(key: string, fallback: string): string {
  const v = process.env[key];
  return v && v.trim() ? v.trim() : fallback;
}

export const ENV_CONFIG: EnvironmentConfig = {
  developer: {
    name: getEnv("NEXT_PUBLIC_DEVELOPER_NAME", "Developer"),
    url: getEnv("NEXT_PUBLIC_DEVELOPER_URL", "/"),
  },
};
