"use strict";

import { beforeEach, afterEach, describe, it } from "mocha";
import { chai } from "../chai.config.js";
const sandbox = chai.spy.sandbox();

import { createEvent } from "../_mocks/event.js";
import { api } from "../_mocks/api.js";
import { setupApiSpy } from "../_helpers/setupApiSpy.js";
import RuleToAction from "../../src/RuleToAction.mjs";

let event;

describe("multifactor rule", function () {
  beforeEach(function () {
    // reset Auth0 event
    event = createEvent();
    // spy on all Auth0 api methods
    setupApiSpy(sandbox, api);
  });

  afterEach(function () {
    sandbox.restore();
  });

  it("converts mutlifactorRule rule", async function () {
    // Prepare
    let rule = function mutlifactorRule(user, context, callback) {
      // Multifactor
      context.multifactor = {
        provider: "any",
        allowRememberBrowser: false,
      };

      callback(null, user, context);
    };

    // Act
    const converter = new RuleToAction(api);
    await converter.convert(event, rule);

    // Assert

    // Multifactor
    chai
      .expect(api.multifactor.enable)
      .to.have.been.called.with("any", { allowRememberBrowser: false });
  });
});
