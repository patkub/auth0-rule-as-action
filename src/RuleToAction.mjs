import { init } from "./lib/init.mjs";
import { mapEventToContext } from "./lib/mapEventToContext.mjs";

/**
 * Class to convert Auth0 Rule to Post-Login Action
 */
export default class RuleToAction {
  /**
   * Initialize RuleToAction
   * @param {Object} api Post-Login Action api object
   */
  constructor(api) {
    // Store globals for use in Rule callback handler
    this.convertGlobals = {};
    // Post-Login Action api object
    this.api = api;
  }

  /**
   * Auto convert Rule to Action
   * @param {Object} event Post-Login Action event object
   * @param {Function} rule Auth0 Rule function
   * @param {Object} options  options
   * @param {Function} options.callback callback called by Rule
   * @param {Function} options.mapEventToContext maps Post-Login Action event variables to Rule context variables
   */
  async convert(event, rule, options = {}) {
    // Initialize globals
    this.init();

    // map user from event
    const user = event.user;

    // map context from event
    const eventToContextMapper =
      options.mapEventToContext || this.mapEventToContext;
    const context = eventToContextMapper(event);

    this.convertGlobals = {};
    this.convertGlobals.oldContext = structuredClone(context);

    const callback = options.callback || this.defaultRuleCallback;

    // Run the rule, result handled by callback
    rule(user, context, callback.bind(this));
  }

  /**
   * Initialize globals
   */
  init() {
    return init();
  }

  /**
   * Map event variables to context variables
   * @param {Object} event Post-Login Action event
   * @return {Object} context
   */
  mapEventToContext(event) {
    return mapEventToContext(event);
  }

  /**
   * Get conversion globals
   * @returns {Object} convertGlobals
   */
  getConvertGlobals() {
    return this.convertGlobals;
  }

  /**
   * Handle Rule callback function
   * @param {Object} obj
   * @param {Object} newUser Rule modified user object
   * @param {Object} newContext Rule modified context object
   */
  async defaultRuleCallback(obj, newUser, newContext) {
    // Post-Login Action api object
    const api = this.api;

    if (obj instanceof Error) {
      // handle errors
      console.log(`Error: ${obj.message}`);
      api.access.deny(obj.message);
    } else if (obj === null && newContext.redirect?.url) {
      // handle redirect
      api.redirect.sendUserTo(newContext.redirect.url);
    } else {
      // success, have "newUser" and "newContext" variables
      // handle changes applied to context by Rule
      this.handleContextMutations(newContext);
    }
  }

  /**
   * Handles changes applied to context by Rule
   * @param {Object} newContext Rule modified context object
   */
  async handleContextMutations(newContext) {
    // Post-Login Action api
    const api = this.api;
    // old context from convert method before Rule modifications
    const oldContext = this.convertGlobals.oldContext;

    // set ID and Access token claims that changed between newContext and oldContext
    for (const [claim, value] of Object.entries(newContext.idToken || {})) {
      if (value && value != oldContext.idToken[claim]) {
        api.idToken.setCustomClaim(claim, value);
      }
    }
    for (const [claim, value] of Object.entries(newContext.accessToken || {})) {
      if (value && value != oldContext.accessToken[claim]) {
        api.accessToken.setCustomClaim(claim, value);
      }
    }

    // set SAML configuration mappings
    for (const [claim, value] of Object.entries(
      newContext.samlConfiguration?.mappings || {},
    )) {
      if (value && value != oldContext.samlConfiguration?.mappings[claim]) {
        api.samlResponse.setAttribute(claim, value);
      }
    }

    // set SAML configuration lifetime
    if (
      newContext.samlConfiguration?.lifetimeInSeconds &&
      newContext.samlConfiguration?.lifetimeInSeconds !=
        oldContext.samlConfiguration?.lifetimeInSeconds
    ) {
      api.samlResponse.setLifetimeInSeconds(
        newContext.samlConfiguration.lifetimeInSeconds,
      );
    }

    // set multifactor options
    if (
      newContext.multifactor?.provider &&
      newContext.multifactor?.provider != oldContext.multifactor?.provider
    ) {
      // "options" is newContext.multifactor without "provider" key
      const { provider, ...options } = newContext.multifactor;
      api.multifactor.enable(provider, options);
    }
  }
}
