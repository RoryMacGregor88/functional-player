import { CHARS } from '@/src/utils/constants';

export default function generateTempPassword(): string {
  return new Array(6)
    .fill(undefined)
    .reduce((acc) => acc + CHARS[Math.floor(Math.random() * CHARS.length)], '');
}
