// Foo Bar -> FB
export const getNameInitials = (name, maxLen = 2) => Array.prototype.map.call(
  (name || '').split(" "),
  (part) => part.substring(0,1).toUpperCase()
)
.slice(0, maxLen)
.join('')
