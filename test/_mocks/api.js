/* eslint-disable no-unused-vars */
// https://auth0.com/docs/customize/actions/flows-and-triggers/login-flow/api-object

const api = {
  access: {
    deny: (code, reason) => {},
  },
  accessToken: {
    setCustomClaim: (name, value) => {},
    addScope: (scope) => {},
    removeScope: (scope) => {},
  },
  authentication: {
    recordMethod: (provider_url) => {},
    challengeWith: (factor, options) => {},
    challengeWithAny: (factors) => {},
    enrollWith: (factor, options) => {},
    enrollWithAny: (factors) => {},
    setPrimaryUser: (primary_user_id) => {},
  },
  cache: {
    delete: (key) => {},
    get: (key) => {},
    set: (key, value, options) => {},
  },
  idToken: {
    setCustomClaim: (name, value) => {},
  },
  multifactor: {
    enable: (provider, options) => {},
  },
  redirect: {
    encodeToken: (options) => {},
    sendUserTo: (url, options) => {},
    validateToken: (options) => {},
  },
  refreshToken : {
    revoke: (reason) => {},
    setExpiresAt: (absolute) => {},
    setIdleExpiresAt: (idle) => {},
  },
  rules: {
    wasExecuted: (ruleId) => {},
  },
  samlResponse: {
    setAttribute: (attribute, value) => {},
    setAudience: (audience) => {},
    setIssuer: (issuer) => {},
    setEncryptionPublicKey: (encryptionPublicKey) => {},
    setRecipient: (recipient) => {},
    setCreateUpnClaim: (createUpnClaim) => {},
    setPassthroughClaimsWithNoMapping: (passthroughClaimsWithNoMapping) => {},
    setMapUnknownClaimsAsIs: (mapUnknownClaimsAsIs) => {},
    setMapIdentities: (mapIdentities) => {},
    setDestination: (destination) => {},
    setRelayState: (relayState) => {},
    setLifetimeInSeconds: (lifetimeInSeconds) => {},
    setSignResponse: (signResponse) => {},
    setNameIdentifierFormat: (nameIdentifierFormat) => {},
    setNameIdentifierProbes: (nameIdentifierProbes) => {},
    setAuthnContextClassRef: (authnContextClassRef) => {},
    setSigningCert: (signingCert) => {},
    setIncludeAttributeNameFormat: (includeAttributeNameFormat) => {},
    setEncryptionCert: (encryptionCert) => {},
    setCert: (cert) => {},
    setKey: (key) => {}
  },
  session: {
    revoke: (reason, options) => {},
    setExpiresAt: (absolute) => {},
    setIdleExpiresAt: (idle) => {}
  },
  transation: {
    setMetadata: (name, value) => {}
  },
  user: {
    setAppMetadata: (name, value) => {},
    setUserMetadata: (name, value) => {},
  },
};

export { api };
