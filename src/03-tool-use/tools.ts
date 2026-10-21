import type Anthropic from "@anthropic-ai/sdk";

/** Tool function: returns the current date/time in the requested format. */
export function getCurrentDatetime(
  dateFormat: string = "%Y-%m-%d %H:%M:%S"
): string {
  if (!dateFormat) {
    throw new Error("dateFormat cannot be empty");
  }

  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");

  const tokens: Record<string, string> = {
    "%Y": String(now.getFullYear()),
    "%m": pad(now.getMonth() + 1),
    "%d": pad(now.getDate()),
    "%H": pad(now.getHours()),
    "%M": pad(now.getMinutes()),
    "%S": pad(now.getSeconds()),
  };

  return dateFormat.replace(/%[YmdHMS]/g, (t) => tokens[t]);
}

/** Tool schema: how the function is described to Claude. */
export const getCurrentDatetimeSchema: Anthropic.Tool = {
  name: "get_current_datetime",
  description:
    "Returns the current date and time formatted with the given format string. " +
    "Use this when the user asks about the current date or time, or when you need today's date " +
    "for a calculation. Supported codes: %Y (year), %m (month), %d (day), %H (hour), %M (minute), %S (second). " +
    "Returns a plain string.",
  input_schema: {
    type: "object",
    properties: {
      date_format: {
        type: "string",
        description:
          'Format string using the codes above. Defaults to "%Y-%m-%d %H:%M:%S" if omitted.',
      },
    },
    required: [],
  },
};
