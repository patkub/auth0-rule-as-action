"use strict";

import { beforeEach, afterEach, describe, it } from "mocha";
import { chai } from "../chai.config.js";
const sandbox = chai.spy.sandbox();

import { createEvent } from "../_mocks/event.js";
import { api } from "../_mocks/api.js";
import { setupApiSpy } from "../_helpers/setupApiSpy.js";
import RuleToAction from "../../src/RuleToAction.mjs";

let event;

describe("scope rule", function () {
  beforeEach(function () {
    // reset Auth0 event
    event = createEvent();
    // spy on all Auth0 api methods
    setupApiSpy(sandbox, api);
  });

  afterEach(function () {
    sandbox.restore();
  });

  it("converts scope rule", async function () {
    // Prepare
    let rule = function scopeRule(user, context, callback) {
      context.accessToken.scope.push("read:messages");
      callback(null, user, context);
    };

    // Act
    const converter = new RuleToAction(api);
    await converter.convert(event, rule);

    // Assert
    chai
      .expect(api.accessToken.addScope)
      .to.have.been.called.with("read:messages");
  });
});
