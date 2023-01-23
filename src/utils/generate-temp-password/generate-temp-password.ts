import { CHARS } from '@/src/utils/constants';

function generateTempPassword(): string {
  return new Array(6)
    .fill(undefined)
    .reduce((acc) => acc + CHARS[Math.floor(Math.random() * CHARS.length)], '');
}

export default generateTempPassword;
