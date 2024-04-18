import dayjs from "dayjs";

export function dateTimeParser(date: string): string {
  return dayjs(date, "YYYY-mm-ddTHH:mm:ss").format("DD/MM/YYYY HH:mm");
}

export function dateParser(date: string): string {
  return dayjs(date, "YYYY-mm-ddTHH:mm:ss").format("DD/MM/YYYY");
}
