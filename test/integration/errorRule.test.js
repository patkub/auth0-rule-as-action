"use strict";

import { beforeEach, afterEach, describe, it } from "mocha";
import { chai } from "../chai.config.js";
const sandbox = chai.spy.sandbox();

import { createEvent } from "../_mocks/event.js";
import { api } from "../_mocks/api.js";
import { setupApiSpy } from "../_helpers/setupApiSpy.js";
import { UnauthorizedError } from "../../src/lib/init.mjs";
import RuleToAction from "../../src/RuleToAction.mjs";

let event;

describe("error rule", function () {
  beforeEach(function () {
    // reset Auth0 event
    event = createEvent();
    // spy on all Auth0 api methods
    setupApiSpy(sandbox, api);
  });

  afterEach(function () {
    sandbox.restore();
  });

  it("denies access for rule that throws error", async function () {
    // Prepare
    let rule = function (user, context, callback) {
      return callback(new UnauthorizedError("This app is unavailable"));
    };

    // Act
    const converter = new RuleToAction(api);
    await converter.convert(event, rule);

    // Assert
    chai
      .expect(api.access.deny)
      .to.have.been.called.with("This app is unavailable");
  });
});
