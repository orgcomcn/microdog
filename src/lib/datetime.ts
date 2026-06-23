const shanghaiDateTimeFormatter = new Intl.DateTimeFormat("zh-CN", {
  timeZone: "Asia/Shanghai",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

export function formatShanghaiDateTime(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);

  return shanghaiDateTimeFormatter.format(date);
}

export function parseShanghaiDateTimeLocal(value: string) {
  const matched = value.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/,
  );

  if (!matched) {
    throw new Error("时间格式不正确。");
  }

  const [, year, month, day, hour, minute, second = "00"] = matched;

  return new Date(
    Date.UTC(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour) - 8,
      Number(minute),
      Number(second),
    ),
  );
}

export function toShanghaiDateTimeLocalValue(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);
  const shifted = new Date(date.getTime() + 8 * 60 * 60 * 1000);

  return shifted.toISOString().slice(0, 16);
}
