// config/developer-link.ts
import { ENV_CONFIG } from "@/config/env";

export type DeveloperConfig = {
  readonly url: string;
  readonly label: string;
};

export const DEVELOPER_CONFIG: DeveloperConfig = {
  url: ENV_CONFIG.developer.url,
  label: ENV_CONFIG.developer.name,
};
