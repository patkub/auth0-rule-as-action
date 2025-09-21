"use strict";

import { beforeEach, afterEach, describe, it } from "mocha";
import { chai } from "../chai.config.js";
const sandbox = chai.spy.sandbox();

import { createEvent } from "../_mocks/event.js";
import { api } from "../_mocks/api.js";
import { setupApiSpy } from "../_helpers/setupApiSpy.js";
import RuleToAction from "../../src/RuleToAction.mjs";

let event;

describe("example rule", function () {
  beforeEach(function () {
    // reset Auth0 event
    event = createEvent();
    // spy on all Auth0 api methods
    setupApiSpy(sandbox, api);
  });

  afterEach(function () {
    sandbox.restore();
  });

  it("converts exampleRule rule", async function () {
    // Prepare
    let rule = function exampleRule(user, context, callback) {
      // ID and Access token claims
      context.idToken["https://example.com/testIDToken"] = "testIDTokenValue";
      // Secrets
      context.idToken["https://example.com/testSecret"] =
        configuration.TEST_SECRET;
      context.accessToken["https://example.com/testAccessToken"] =
        "testAccessTokenValue";

      // SAML
      context.samlConfiguration.mappings = {
        "https://example.com/SAML/Attributes/Role": "role",
        "https://example.com/SAML/Attributes/RoleSessionName": "session",
      };
      context.samlConfiguration.audience =
        "https://example.com/SAML/Attributes/Audience";
      context.samlConfiguration.issuer =
        "https://example.com/SAML/Attributes/Issuer";
      context.samlConfiguration.encryptionPublicKey = `-----BEGIN PUBLIC KEY-----FAKE-----END PUBLIC KEY-----`;
      context.samlConfiguration.recipient =
        "https://example.com/SAML/Attributes/Recipient";
      context.samlConfiguration.createUpnClaim = true;
      context.samlConfiguration.passthroughClaimsWithNoMapping = true;
      context.samlConfiguration.mapUnknownClaimsAsIs = true;
      context.samlConfiguration.mapIdentities = true;
      context.samlConfiguration.destination =
        "https://example.com/SAML/Attributes/Destination";
      context.samlConfiguration.relayState =
        "https://example.com/SAML/Attributes/relayState";
      context.samlConfiguration.lifetimeInSeconds = 3600;
      context.samlConfiguration.signResponse = true;
      context.samlConfiguration.nameIdentifierFormat =
        "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress";
      context.samlConfiguration.nameIdentifierProbes = [
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
      ];
      context.samlConfiguration.authnContextClassRef =
        "urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport";
      context.samlConfiguration.signingCert = `-----BEGIN CERTIFICATE-----FAKE-----END CERTIFICATE-----`;
      context.samlConfiguration.includeAttributeNameFormat = true;

      // Multifactor
      context.multifactor = {
        provider: "any",
        allowRememberBrowser: false,
      };

      callback(null, user, context);
    };

    // Define secrets
    event.secrets = {};
    event.secrets.TEST_SECRET = "secret_value";

    // Act
    const converter = new RuleToAction(api);
    await converter.convert(event, rule);

    // Assert
    // ID and Access token claims
    chai
      .expect(api.idToken.setCustomClaim)
      .to.have.been.called.with(
        "https://example.com/testIDToken",
        "testIDTokenValue",
      );
    chai
      .expect(api.idToken.setCustomClaim)
      .to.have.been.called.with(
        "https://example.com/testSecret",
        event.secrets.TEST_SECRET,
      );
    chai
      .expect(api.accessToken.setCustomClaim)
      .to.have.been.called.with(
        "https://example.com/testAccessToken",
        "testAccessTokenValue",
      );

    // SAML
    chai
      .expect(api.samlResponse.setAttribute)
      .to.have.been.called.with(
        "https://example.com/SAML/Attributes/Role",
        "role",
      );
    chai
      .expect(api.samlResponse.setAttribute)
      .to.have.been.called.with(
        "https://example.com/SAML/Attributes/RoleSessionName",
        "session",
      );
    chai
      .expect(api.samlResponse.setAudience)
      .to.have.been.called.with("https://example.com/SAML/Attributes/Audience");
    chai
      .expect(api.samlResponse.setIssuer)
      .to.have.been.called.with("https://example.com/SAML/Attributes/Issuer");
    chai
      .expect(api.samlResponse.setEncryptionPublicKey)
      .to.have.been.called.with(
        "-----BEGIN PUBLIC KEY-----FAKE-----END PUBLIC KEY-----",
      );
    chai
      .expect(api.samlResponse.setRecipient)
      .to.have.been.called.with(
        "https://example.com/SAML/Attributes/Recipient",
      );
    chai
      .expect(api.samlResponse.setCreateUpnClaim)
      .to.have.been.called.with(true);
    chai
      .expect(api.samlResponse.setPassthroughClaimsWithNoMapping)
      .to.have.been.called.with(true);
    chai
      .expect(api.samlResponse.setMapUnknownClaimsAsIs)
      .to.have.been.called.with(true);
    chai
      .expect(api.samlResponse.setMapIdentities)
      .to.have.been.called.with(true);
    chai
      .expect(api.samlResponse.setDestination)
      .to.have.been.called.with(
        "https://example.com/SAML/Attributes/Destination",
      );
    chai
      .expect(api.samlResponse.setRelayState)
      .to.have.been.called.with(
        "https://example.com/SAML/Attributes/relayState",
      );
    chai
      .expect(api.samlResponse.setLifetimeInSeconds)
      .to.have.been.called.with(3600);
    chai
      .expect(api.samlResponse.setSignResponse)
      .to.have.been.called.with(true);
    chai
      .expect(api.samlResponse.setNameIdentifierFormat)
      .to.have.been.called.with(
        "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress",
      );
    chai
      .expect(api.samlResponse.setNameIdentifierProbes)
      .to.have.been.called.with([
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
      ]);
    chai
      .expect(api.samlResponse.setAuthnContextClassRef)
      .to.have.been.called.with(
        "urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport",
      );
    chai
      .expect(api.samlResponse.setSigningCert)
      .to.have.been.called.with(
        "-----BEGIN CERTIFICATE-----FAKE-----END CERTIFICATE-----",
      );
    chai
      .expect(api.samlResponse.setIncludeAttributeNameFormat)
      .to.have.been.called.with(true);

    // Multifactor
    chai
      .expect(api.multifactor.enable)
      .to.have.been.called.with("any", { allowRememberBrowser: false });

    // Secrets
    chai.expect(configuration.TEST_SECRET).to.equal(event.secrets.TEST_SECRET);
  });
});
