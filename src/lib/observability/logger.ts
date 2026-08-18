import "server-only";

type LogValue = string | number | boolean | null | undefined;
type LogFields = Record<string, LogValue>;

function write(level: "info" | "warn" | "error", event: string, fields: LogFields = {}) {
  const payload = JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    service: "akhil-portfolio",
    event,
    ...fields,
  });

  if (level === "error") console.error(payload);
  else if (level === "warn") console.warn(payload);
  else console.info(payload);
}

export const logger = {
  info: (event: string, fields?: LogFields) => write("info", event, fields),
  warn: (event: string, fields?: LogFields) => write("warn", event, fields),
  error: (event: string, fields?: LogFields) => write("error", event, fields),
};

export function errorName(error: unknown) {
  return error instanceof Error ? error.name : "UnknownError";
}
