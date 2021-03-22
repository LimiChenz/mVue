export function isObject(value) {
   return typeof value === 'object' && Object.prototype.toString(value) === '[object Object]'
}