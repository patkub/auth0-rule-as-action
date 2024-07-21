/**
 * Initialize globals
 */
function init() {
    /**
     * Define errors used in rules
     */
    class UnauthorizedError extends Error {
        constructor(message) {
            super(message)
        }
    }
    global.UnauthorizedError = UnauthorizedError;

    /**
     * Handle secrets
     */
    global.configuration = {};
}

export {
    init
}