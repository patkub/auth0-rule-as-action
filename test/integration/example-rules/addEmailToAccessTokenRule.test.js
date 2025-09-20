"use strict";

import { beforeEach, afterEach, describe, it } from "mocha";
import { chai } from "../../chai.config.js";
const sandbox = chai.spy.sandbox();

import { createEvent } from "../../_mocks/event.js";
import { api } from "../../_mocks/api.js";
import { setupApiSpy } from "../../_helpers/setupApiSpy.js";
import RuleToAction from "../../../src/RuleToAction.mjs";

let event, addEmailToAccessTokenRule;

describe("addEmailToAccessTokenRule", function () {
  beforeEach(function () {
    // reset Auth0 event
    event = createEvent();
    // spy on all Auth0 api methods
    setupApiSpy(sandbox, api);

    /**
     * This rule will add the authenticated user's `email` attribute value to the access token.
     *
     * @title Add email to access token
     * @overview Add the authenticated user's email address to the access token.
     * @gallery true
     * @category access control
     */
    addEmailToAccessTokenRule = function addEmailToAccessToken(
      user,
      context,
      callback,
    ) {
      // This rule adds the authenticated user's email address to the access token.
      var namespace = "https://example.com/";

      context.accessToken[namespace + "email"] = user.email;
      return callback(null, user, context);
    };
  });

  afterEach(function () {
    sandbox.restore();
  });

  it("addEmailToAccessTokenRule adds user's email address to access token", async function () {
    // Act
    const converter = new RuleToAction(api);
    await converter.convert(event, addEmailToAccessTokenRule);

    // Assert
    chai
      .expect(api.accessToken.setCustomClaim)
      .to.have.been.called.with("https://example.com/email", event.user.email);
  });
});
