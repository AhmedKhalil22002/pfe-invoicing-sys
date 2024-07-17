import { format, parse, parseISO } from 'date-fns';

export function transformDate(dateString: string) {
  const date = parseISO(dateString);
  return format(date, 'dd-MM-yyyy');
}

export function transformDateTime(dateString: string) {
  const date = parseISO(dateString);
  return format(date, 'yyyy-MM-dd HH:mm:ss');
}
