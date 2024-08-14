import { DATE_FORMAT } from '@/api/enums/date-formats';

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const DATE_FORMAT_PATTERNS: { [key in DATE_FORMAT]: RegExp } = {
  [DATE_FORMAT.yyyy]: /^\d{4}$/,
  [DATE_FORMAT.yy_MM]: /^\d{2}-\d{2}$/,
  [DATE_FORMAT.yyyy_MM]: /^\d{4}-\d{2}$/
};

export function parseSequenceString(sequence: string) {
  const regex = /^(.+?)-(\d{4}-\d{2}|\d{2}-\d{2}|\d{4})-(\d+)$/;
  const match = sequence.match(regex);

  if (!match) {
    return {
      prefix: '',
      dynamic_sequence: DATE_FORMAT.yyyy,
      next: 0
    };
  }

  const [, prefix, dynamicSequence, nextStr] = match;
  const next = parseInt(nextStr, 10);

  const knownFormat =
    (Object.keys(DATE_FORMAT_PATTERNS).find((format) =>
      DATE_FORMAT_PATTERNS[format as DATE_FORMAT].test(dynamicSequence)
    ) as DATE_FORMAT) || DATE_FORMAT.yyyy;

  return {
    prefix,
    dynamic_sequence: knownFormat,
    next: isNaN(next) ? 0 : next
  };
}
