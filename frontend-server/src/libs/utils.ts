import dayjs from "dayjs";
import "dayjs/locale/it";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
dayjs.locale("it");

export function dateTimeParser(date: string): string {
  return dayjs(date, "YYYY-mm-ddTHH:mm:ss").format("DD/MM/YYYY HH:mm");
}

export function dateParser(date: string): string {
  return dayjs(date, "YYYY-mm-ddTHH:mm:ss").format("DD/MM/YYYY");
}

export function timeElapsed(date: string): string {
  return dayjs(date, "YYYY-MM-DDTHH:mm:ss.SSSSSSZ").fromNow();
}
