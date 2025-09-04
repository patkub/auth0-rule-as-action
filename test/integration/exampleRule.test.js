"use strict";

import { beforeEach, afterEach, describe, it } from "mocha";
import { chai } from "../chai.config.js";
const sandbox = chai.spy.sandbox();

import { createEvent } from "../_mocks/event.js";
import { api } from "../_mocks/api.js";
import { setupApiSpy } from "../_helpers/setupApiSpy.js";
import { convert } from "../../src/RuleToAction.mjs"

let event;

describe('example rule', function () {

  beforeEach(function () {
    // reset Auth0 event
    event = createEvent();
    // spy on all Auth0 api methods
    setupApiSpy(sandbox, api);
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('converts exampleRule rule', async function () {
    // Prepare
    let rule = function exampleRule(user, context, callback) {
      // ID and Access token claims
      context.idToken["https://example.com/testIDToken"] = "testIDTokenValue";
      // Secrets
      context.idToken["https://example.com/testSecret"] = configuration.TEST_SECRET;
      context.accessToken["https://example.com/testAccessToken"] = "testAccessTokenValue";
      // SAML
      context.samlConfiguration.mappings = {
        'https://example.com/SAML/Attributes/Role': 'role',
        'https://example.com/SAML/Attributes/RoleSessionName': 'session'
      };
      // Multifactor
      context.multifactor = {
        provider: "any",
        allowRememberBrowser: false,
      };

      callback(null, user, context);
    }

    // Define secrets
    event.secrets = {};
    event.secrets.TEST_SECRET = "secret_value";

    // Act
    await convert(event, api, rule);

    // Assert
    chai.expect(api.idToken.setCustomClaim).to.have.been.called.with("https://example.com/testIDToken", "testIDTokenValue");
    chai.expect(api.idToken.setCustomClaim).to.have.been.called.with("https://example.com/testSecret", event.secrets.TEST_SECRET);
    chai.expect(api.accessToken.setCustomClaim).to.have.been.called.with("https://example.com/testAccessToken", "testAccessTokenValue");
    chai.expect(api.samlResponse.setAttribute).to.have.been.called.with("https://example.com/SAML/Attributes/Role", "role");
    chai.expect(api.samlResponse.setAttribute).to.have.been.called.with("https://example.com/SAML/Attributes/RoleSessionName", "session");
    chai.expect(api.multifactor.enable).to.have.been.called.with("any", { allowRememberBrowser: false });
    // Secrets
    chai.expect(configuration.TEST_SECRET).to.equal(event.secrets.TEST_SECRET);
  });
});