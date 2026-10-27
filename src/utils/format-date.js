/**
 * ISO 날짜 문자열을 'YYYY.MM.DD HH:mm' 형식으로 변환한다.
 * @param {string} isoString - 변환할 날짜 문자열
 * @param {boolean} hasTime - 시간 포함 여부 (기본값: true)
 * @returns {string}
 */
export function formatDate(isoString, hasTime = true) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const pad = (num) => String(num).padStart(2, '0');
  const day = `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`;
  if (!hasTime) return day;
  return `${day} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/**
 * 오늘 작성된 글은 시간만, 그 외에는 날짜만 표시한다.
 * @param {string} isoString - 변환할 날짜 문자열
 * @returns {string}
 */
export function formatListDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const isToday = date.toDateString() === new Date().toDateString();
  if (isToday) return formatDate(isoString).split(' ')[1];
  return formatDate(isoString, false);
}
