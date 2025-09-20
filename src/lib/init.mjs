/**
 * Initialize globals
 */
function init() {
  // Define errors used in rules
  global.UnauthorizedError = UnauthorizedError;

  // Handle secrets
  global.configuration = {};
}

/**
 * Define errors used in rules
 */
class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
  }
}

export { init, UnauthorizedError };
