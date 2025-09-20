"use strict";

import { beforeEach, afterEach, describe, it } from "mocha";
import { chai } from "../chai.config.js";
const sandbox = chai.spy.sandbox();

import { createEvent } from "../_mocks/event.js";
import { mapEventToContext } from "../../src/lib/mapEventToContext.mjs";

let event;

describe("mapEventToContext", function () {
  beforeEach(function () {
    // reset Auth0 event
    event = createEvent();
  });

  afterEach(function () {
    sandbox.restore();
  });

  it("maps event to context", async function () {
    // Act
    // defined context variables based on event varibles
    const context = mapEventToContext(event);

    // Assert
    // context variables have been defined based on event variables
    chai.expect(context.tenant).to.equal(event.tenant.id);
    chai.expect(context.clientID).to.equal(event.client.client_id);
    chai.expect(context.clientName).to.equal(event.client.name);
    chai.expect(context.clientMetadata).to.deep.equal(event.client.metadata);
    chai.expect(context.connectionID).to.equal(event.connection.id);
    chai.expect(context.connection).to.equal(event.connection.name);
    chai.expect(context.connectionStrategy).to.equal(event.connection.strategy);
    chai
      .expect(context.connectionMetadata)
      .to.deep.equal(event.connection.metadata);
    chai.expect(context.protocol).to.equal(event.transaction?.protocol);
    chai
      .expect(context.riskAssessment)
      .to.deep.equal(event.authentication?.riskAssessment);
    chai.expect(context.sessionID).to.equal(event.session?.id);
    chai.expect(context.stats).to.deep.equal(event.stats);

    // context.request
    chai
      .expect(context.request)
      .excluding(["geoip", "user_agent", "userAgent"])
      .to.deep.equal(event.request);
    // context.request properties get converted from camelCase in event to snake_case in context
    chai.expect(context.request.userAgent).to.equal(event.request.user_agent);
    chai
      .expect(context.request.geoip.country_code)
      .to.equal(event.request.geoip.countryCode);
    chai
      .expect(context.request.geoip.country_code3)
      .to.equal(event.request.geoip.countryCode3);
    chai
      .expect(context.request.geoip.country_name)
      .to.equal(event.request.geoip.countryName);
    chai
      .expect(context.request.geoip.region)
      .to.equal(event.request.geoip.region);
    chai
      .expect(context.request.geoip.city_name)
      .to.equal(event.request.geoip.cityName);
    chai
      .expect(context.request.geoip.latitude)
      .to.equal(event.request.geoip.latitude);
    chai
      .expect(context.request.geoip.longitude)
      .to.equal(event.request.geoip.longitude);
    chai
      .expect(context.request.geoip.continent_code)
      .to.equal(event.request.geoip.continentCode);
    chai
      .expect(context.request.geoip.time_zone)
      .to.equal(event.request.geoip.timeZone);

    chai
      .expect(context.authentication)
      .to.deep.equal(event.authentication?.methods);
    chai.expect(context.authorization).to.deep.equal(event.authorization);
    chai.expect(context.organization).to.deep.equal(event.organization);
    chai
      .expect(context.sso.current_clients)
      .to.deep.equal(event.session?.clients);
  });

  it("maps event secrets to global configuration secrets", async function () {
    // Prepare
    event.secrets = {};
    event.secrets.TEST_SECRET = "secret_value";

    // Act
    // defined context variables based on event varibles
    mapEventToContext(event);

    // Assert
    // global configuration secrets have been defined based on event secrets
    chai.expect(global.configuration).to.deep.equal(event.secrets);
    chai
      .expect(global.configuration.TEST_SECRET)
      .to.equal(event.secrets.TEST_SECRET);
  });
});
