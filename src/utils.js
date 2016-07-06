
//
// If val is an array, return it. If it is undefined, return defaultval.
// Otherwise return [val]
//
export function arrayise(val, defaultval) {
  return val ?
    Array.isArray(val) ?
      val : [val] : defaultval;
}
