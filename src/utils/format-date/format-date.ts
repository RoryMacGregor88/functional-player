import { format, parseISO } from 'date-fns';

export default function formatDate(isoString: string): string {
  return format(parseISO(isoString), 'MMMM qo uuuu');
}
