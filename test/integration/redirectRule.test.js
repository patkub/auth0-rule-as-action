"use strict";

import { beforeEach, afterEach, describe, it } from "mocha";
import { chai } from "../chai.config.js";
const sandbox = chai.spy.sandbox();

import { createEvent } from "../_mocks/event.js";
import { api } from "../_mocks/api.js";
import { setupApiSpy } from "../_helpers/setupApiSpy.js";
import { convert } from "../../src/RuleToAction.mjs"

let event;

describe('redirect rule', function () {

  beforeEach(function () {
    // reset Auth0 event
    event = createEvent();
    // spy on all Auth0 api methods
    setupApiSpy(sandbox, api);
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('converts redirect rule', async function () {
    // Prepare
    let rule = function simpleRedirectRule(user, context, callback) {
      context.redirect = {
        url: "https://example.com/foo"
      };
      callback(null, user, context);
    }

    // Act
    await convert(event, api, rule);

    // Assert
    chai.expect(api.redirect.sendUserTo).to.have.been.called.with("https://example.com/foo");
  });
});
