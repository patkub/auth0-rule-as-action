/**
 * Map event variables to context variables
 * @param {Object} event Post-Login Action event
 * @return {Object} context
 */
function mapEventToContext(event) {
  // Auth0 Post-Login action Event object: https://auth0.com/docs/customize/actions/flows-and-triggers/login-flow/event-object
  // Auth0 Rules Context object: https://auth0.com/docs/customize/rules/context-object

  // Initialize context object
  const context = {
    // Default context properties
    sso: {},

    // Context properties that get set by the Rule
    accessToken: {},
    idToken: {},
    samlConfiguration: {
      mappings: {},
      nameIdentifierProbes: [],
    },
    multifactor: {},
  };

  // Create a deep copy of event to avoid mutating the original event object
  const eventCopy = structuredClone(event);

  // Map event variables to context variables
  context.tenant = eventCopy.tenant.id;
  context.clientID = eventCopy.client.client_id;
  context.clientName = eventCopy.client.name;
  context.clientMetadata = eventCopy.client.metadata;
  context.connectionID = eventCopy.connection.id;
  context.connection = eventCopy.connection.name;
  context.connectionStrategy = eventCopy.connection.strategy;
  context.connectionMetadata = eventCopy.connection.metadata;
  context.protocol = eventCopy.transaction?.protocol;
  context.riskAssessment = eventCopy.authentication?.riskAssessment;
  context.stats = eventCopy.stats;
  context.sessionID = eventCopy.session?.id;

  // Exclude properties 'geoip' and 'user_agent'
  // eslint-disable-next-line no-unused-vars
  context.request = (({ geoip, user_agent, ...object }) => object)(
    eventCopy.request,
  );
  context.request.userAgent = eventCopy.request.user_agent;
  // geographic IP information
  if (eventCopy.request?.geoip) {
    context.request.geoip = {};
    context.request.geoip.country_code = eventCopy.request.geoip.countryCode;
    context.request.geoip.country_code3 = eventCopy.request.geoip.countryCode3;
    context.request.geoip.country_name = eventCopy.request.geoip.countryName;
    context.request.geoip.city_name = eventCopy.request.geoip.cityName;
    context.request.geoip.latitude = eventCopy.request.geoip.latitude;
    context.request.geoip.longitude = eventCopy.request.geoip.longitude;
    context.request.geoip.time_zone = eventCopy.request.geoip.timeZone;
    context.request.geoip.continent_code =
      eventCopy.request.geoip.continentCode;
    context.request.geoip.subdivision_code =
      eventCopy.request.geoip.subdivisionCode;
    context.request.geoip.subdivision_name =
      eventCopy.request.geoip.subdivisionName;
  }

  context.authentication = eventCopy.authentication?.methods;
  context.authorization = eventCopy.authorization;
  context.organization = eventCopy.organization;
  context.sso.current_clients = eventCopy.session?.clients;

  // Map secrets
  global.configuration = eventCopy.secrets;

  // Return context determined from event
  return context;
}

export { mapEventToContext };
