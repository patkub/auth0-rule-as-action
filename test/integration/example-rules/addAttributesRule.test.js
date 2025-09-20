"use strict";

import { beforeEach, afterEach, describe, it } from "mocha";
import { chai } from "../../chai.config.js";
const sandbox = chai.spy.sandbox();

import { createEvent } from "../../_mocks/event.js";
import { api } from "../../_mocks/api.js";
import { setupApiSpy } from "../../_helpers/setupApiSpy.js";
import RuleToAction from "../../../src/RuleToAction.mjs";

let event, addAttributesRule;

describe("addAttributesRule", function () {
  beforeEach(function () {
    // reset Auth0 event
    event = createEvent();
    // spy on all Auth0 api methods
    setupApiSpy(sandbox, api);

    /**
     *
     * This rule will add an attribute to the user only for the login transaction (i.e. they won't be persisted to the user).
     *
     * This is useful for cases where you want to enrich the user information for a specific application.
     *
     * @title Add attributes to a user for specific connection
     * @overview Add attributes to a user for specific connection.
     * @gallery true
     * @category enrich profile
     */
    addAttributesRule = function addAttributes(user, context, callback) {
      if (context.connection === "company.com") {
        context.idToken["https://example.com/vip"] = true;
      }

      callback(null, user, context);
    };
  });

  afterEach(function () {
    sandbox.restore();
  });

  it("addAttributesRule adds attribute for specific connection", async function () {
    // Prepare
    event.connection.name = "company.com";

    // Act
    const converter = new RuleToAction(api);
    await converter.convert(event, addAttributesRule);

    // Assert
    chai
      .expect(api.idToken.setCustomClaim)
      .to.have.been.called.with("https://example.com/vip", true);
  });

  it("addAttributesRule doesn't add attribute for other connections", async function () {
    // Prepare
    event.connection.name = "example.com";

    // Act
    const converter = new RuleToAction(api);
    await converter.convert(event, addAttributesRule);

    // Assert
    chai
      .expect(api.idToken.setCustomClaim)
      .to.not.have.been.called.with("https://example.com/vip", true);
  });
});
