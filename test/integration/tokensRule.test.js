"use strict";

import { beforeEach, afterEach, describe, it } from "mocha";
import { chai } from "../chai.config.js";
const sandbox = chai.spy.sandbox();

import { createEvent } from "../_mocks/event.js";
import { api } from "../_mocks/api.js";
import { setupApiSpy } from "../_helpers/setupApiSpy.js";
import RuleToAction from "../../src/RuleToAction.mjs";

let event;

describe("tokens rule", function () {
  beforeEach(function () {
    // reset Auth0 event
    event = createEvent();
    // spy on all Auth0 api methods
    setupApiSpy(sandbox, api);
  });

  afterEach(function () {
    sandbox.restore();
  });

  it("converts tokensRule rule", async function () {
    // Prepare
    let rule = function tokensRule(user, context, callback) {
      // ID and Access token claims
      context.idToken["https://example.com/testIDToken"] = "testIDTokenValue";
      context.accessToken["https://example.com/testAccessToken"] =
        "testAccessTokenValue";
      callback(null, user, context);
    };

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
      .expect(api.accessToken.setCustomClaim)
      .to.have.been.called.with(
        "https://example.com/testAccessToken",
        "testAccessTokenValue",
      );
  });
});
