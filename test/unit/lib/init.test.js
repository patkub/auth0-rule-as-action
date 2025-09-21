"use strict";

import { beforeEach, afterEach, describe, it } from "mocha";
import { chai } from "../../chai.config.js";
const sandbox = chai.spy.sandbox();

import { init } from "../../../src/lib/init.mjs";

describe("unit::lib::init", function () {
  beforeEach(function () {
    // reset global
    delete global.UnauthorizedError;
    delete global.configuration;
  });

  afterEach(function () {
    sandbox.restore();
  });

  it("initializes Rule globals", async function () {
    // Act
    const result = init();
    const unauthorizedError = new global.UnauthorizedError();

    // Assert
    chai.expect(result).to.be.undefined;
    chai.expect(unauthorizedError).to.be.an.instanceOf(Error);
    chai.expect(global.configuration).to.be.an("object").that.is.empty;
  });
});
