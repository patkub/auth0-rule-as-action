"use strict";

import { beforeEach, afterEach, describe, it } from "mocha";
import { chai } from "../chai.config.js";
const sandbox = chai.spy.sandbox();

import { createEvent } from "../_mocks/event.js";
import { api } from "../_mocks/api.js";
import { setupApiSpy } from "../_helpers/setupApiSpy.js";
import { UnauthorizedError } from "../../src/lib/init.mjs";
import { mapEventToContext } from "../../src/lib/mapEventToContext.mjs";
import RuleToAction from "../../src/RuleToAction.mjs";

let event;

describe('emptyRule', function () {

  beforeEach(function () {
    // reset Auth0 event
    event = createEvent();
    // spy on all Auth0 api methods
    setupApiSpy(sandbox, api);
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('converts empty rule with empty context', async function () {
    // Prepare
    let rule = function (user, context, callback) {
      // TODO: implement your rule
      return callback(null, user, context);
    }

    // Act
    const converter = new RuleToAction(api);
    await converter.convert(event, rule);

    // Assert
    // Instantiates global UnauthorizedError
    chai.expect(new global.UnauthorizedError()).to.be.an.instanceof(UnauthorizedError);

    // Get Rule conversion globals
    const recievedConvertGlobals = converter.getConvertGlobals();
    // Maps event variable to context
    const expectedContext = mapEventToContext(event);
    chai.expect(recievedConvertGlobals.oldContext).to.deep.equal(expectedContext);
  });
});