import { format, parseISO } from 'date-fns';

export function transformDate(dateString: string) {
  const date = parseISO(dateString);
  return format(date, 'dd-MM-yyyy');
}
