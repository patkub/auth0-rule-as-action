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
    // set SAML configuration audience
    if (
      newContext.samlConfiguration?.audience &&
      newContext.samlConfiguration?.audience !==
        oldContext.samlConfiguration?.audience
    ) {
      api.samlResponse.setAudience(newContext.samlConfiguration?.audience);
    }
    // set SAML configuration issuer
    if (
      newContext.samlConfiguration?.issuer &&
      newContext.samlConfiguration?.issuer !==
        oldContext.samlConfiguration?.issuer
    ) {
      api.samlResponse.setIssuer(newContext.samlConfiguration?.issuer);
    }
    // set SAML configuration encryptionPublicKey
    if (
      newContext.samlConfiguration?.encryptionPublicKey &&
      newContext.samlConfiguration?.encryptionPublicKey !==
        oldContext.samlConfiguration?.encryptionPublicKey
    ) {
      api.samlResponse.setEncryptionPublicKey(
        newContext.samlConfiguration?.encryptionPublicKey,
      );
    }
    // set SAML configuration recipient
    if (
      newContext.samlConfiguration?.recipient &&
      newContext.samlConfiguration?.recipient !==
        oldContext.samlConfiguration?.recipient
    ) {
      api.samlResponse.setRecipient(newContext.samlConfiguration?.recipient);
    }
    // set SAML configuration UPN (user principal name) claim
    if (
      newContext.samlConfiguration?.createUpnClaim &&
      newContext.samlConfiguration?.createUpnClaim !=
        oldContext.samlConfiguration?.createUpnClaim
    ) {
      api.samlResponse.setCreateUpnClaim(
        newContext.samlConfiguration?.createUpnClaim,
      );
    }
    // set SAML configuration passthroughClaimsWithNoMapping
    if (
      newContext.samlConfiguration?.passthroughClaimsWithNoMapping &&
      newContext.samlConfiguration?.passthroughClaimsWithNoMapping !==
        oldContext.samlConfiguration?.passthroughClaimsWithNoMapping
    ) {
      api.samlResponse.setPassthroughClaimsWithNoMapping(
        newContext.samlConfiguration?.passthroughClaimsWithNoMapping,
      );
    }
    // set SAML configuration mapUnknownClaimsAsIs
    if (
      newContext.samlConfiguration?.mapUnknownClaimsAsIs &&
      newContext.samlConfiguration?.mapUnknownClaimsAsIs !==
        oldContext.samlConfiguration?.mapUnknownClaimsAsIs
    ) {
      api.samlResponse.setMapUnknownClaimsAsIs(
        newContext.samlConfiguration?.mapUnknownClaimsAsIs,
      );
    }
    // set SAML configuration mapIdentities
    if (
      newContext.samlConfiguration?.mapIdentities &&
      newContext.samlConfiguration?.mapIdentities !==
        oldContext.samlConfiguration?.mapIdentities
    ) {
      api.samlResponse.setMapIdentities(
        newContext.samlConfiguration?.mapIdentities,
      );
    }
    // set SAML configuration destination
    if (
      newContext.samlConfiguration?.destination &&
      newContext.samlConfiguration?.destination !==
        oldContext.samlConfiguration?.destination
    ) {
      api.samlResponse.setDestination(
        newContext.samlConfiguration?.destination,
      );
    }
    // set SAML configuration relayState
    if (
      newContext.samlConfiguration?.relayState &&
      newContext.samlConfiguration?.relayState !==
        oldContext.samlConfiguration?.relayState
    ) {
      api.samlResponse.setRelayState(newContext.samlConfiguration?.relayState);
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
    // set SAML configuration setSignResponse
    if (
      newContext.samlConfiguration?.signResponse &&
      newContext.samlConfiguration?.signResponse !=
        oldContext.samlConfiguration?.signResponse
    ) {
      api.samlResponse.setSignResponse(
        newContext.samlConfiguration.signResponse,
      );
    }
    // set SAML configuration setNameIdentifierFormat
    if (
      newContext.samlConfiguration?.nameIdentifierFormat &&
      newContext.samlConfiguration?.nameIdentifierFormat !==
        oldContext.samlConfiguration?.nameIdentifierFormat
    ) {
      api.samlResponse.setNameIdentifierFormat(
        newContext.samlConfiguration.nameIdentifierFormat,
      );
    }
    // set SAML configuration setNameIdentifierProbes
    if (
      newContext.samlConfiguration?.nameIdentifierProbes &&
      !compareArrays(
        newContext.samlConfiguration?.nameIdentifierProbes,
        oldContext.samlConfiguration?.nameIdentifierProbes || [],
      )
    ) {
      api.samlResponse.setNameIdentifierProbes(
        newContext.samlConfiguration.nameIdentifierProbes,
      );
    }
    // set SAML configuration setAuthnContextClassRef
    if (
      newContext.samlConfiguration?.authnContextClassRef &&
      newContext.samlConfiguration?.authnContextClassRef !==
        oldContext.samlConfiguration?.authnContextClassRef
    ) {
      api.samlResponse.setAuthnContextClassRef(
        newContext.samlConfiguration.authnContextClassRef,
      );
    }
    // set SAML configuration setSigningCert
    if (
      newContext.samlConfiguration?.signingCert &&
      newContext.samlConfiguration?.signingCert !==
        oldContext.samlConfiguration?.signingCert
    ) {
      api.samlResponse.setSigningCert(newContext.samlConfiguration.signingCert);
    }
    // set SAML configuration setIncludeAttributeNameFormat
    if (
      newContext.samlConfiguration?.includeAttributeNameFormat &&
      newContext.samlConfiguration?.includeAttributeNameFormat !==
        oldContext.samlConfiguration?.includeAttributeNameFormat
    ) {
      api.samlResponse.setIncludeAttributeNameFormat(
        newContext.samlConfiguration.includeAttributeNameFormat,
      );
    }
    // set SAML configuration setEncryptionCert
    if (
      newContext.samlConfiguration?.encryptionCert &&
      newContext.samlConfiguration?.encryptionCert !==
        oldContext.samlConfiguration?.encryptionCert
    ) {
      api.samlResponse.setEncryptionCert(
        newContext.samlConfiguration.encryptionCert,
      );
    }
    // set SAML configuration setCert
    if (
      newContext.samlConfiguration?.cert &&
      newContext.samlConfiguration?.cert !== oldContext.samlConfiguration?.cert
    ) {
      api.samlResponse.setCert(newContext.samlConfiguration.cert);
    }
    // set SAML configuration setKey
    if (
      newContext.samlConfiguration?.key &&
      newContext.samlConfiguration?.key !== oldContext.samlConfiguration?.key
    ) {
      api.samlResponse.setKey(newContext.samlConfiguration.key);
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

/**
 * Compare two arrays for equality
 * @param {String[]} array1
 * @param {String[]} array2
 * @returns
 */
function compareArrays(array1, array2) {
  if (array1.length !== array2.length) return false;
  array1.sort();
  array2.sort();
  for (let i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) return false;
  }
  return true;
}
