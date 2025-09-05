/**
 * Spy on all methods in api object
 * @param {ChaiSpies.Sandbox} sandbox Chai Spies sandbox
 * @param {Object} api Auth0 api object
 */
function setupApiSpy(sandbox, api) {
  for (const key of Object.keys(api)) {
    for (const method of Object.keys(api[key])) {
      if (api[key][method] instanceof Function) {
        sandbox.on(api[key], method);
      }
    }
  }
}

export { setupApiSpy };
