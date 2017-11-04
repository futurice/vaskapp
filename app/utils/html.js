// &amp; &lt; ... to & >
export const unescapeHtml = str => {
  var map = {amp: '&', lt: '<', le: '≤', gt: '>', ge: '≥', quot: '"', '#039': "'"}
  return str.replace(/&([^;]+);/g, (m, c) => map[c]|| '');
}

