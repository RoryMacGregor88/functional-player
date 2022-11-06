import { CHARS } from '@/src/utils/constants';

function generateTempPassword() {
  let str = '';
  for (let i = 0; i < 6; i++) {
    const char = CHARS[Math.floor(Math.random() * CHARS.length)];
    str = str + char;
  }
  return str;
}

export default generateTempPassword;
