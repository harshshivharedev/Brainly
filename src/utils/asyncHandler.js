/**
 * Higher-order function jo async controller ke errors ko
 * Express ke GLOBAL error handler tak forward karta hai.
 * Isse poore API ka error response shape ek jaisa rehta hai.
 */
const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

export { asyncHandler };