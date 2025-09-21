"use strict";

import { afterEach, describe, it } from "mocha";
import { chai } from "../chai.config.js";
const sandbox = chai.spy.sandbox();

import { areArraysEqualUnordered } from "../../src/utils/utils.mjs";

describe("utils", function () {
  afterEach(function () {
    sandbox.restore();
  });

  it("areArraysEqualUnordered equal same order", async function () {
    // Act
    const result = areArraysEqualUnordered(["a", "b"], ["a", "b"]);

    // Assert
    chai.expect(result).to.be.true;
  });

  it("areArraysEqualUnordered equal different order", async function () {
    // Act
    const result = areArraysEqualUnordered(["a", "b", "c"], ["c", "a", "b"]);

    // Assert
    chai.expect(result).to.be.true;
  });

  it("areArraysEqualUnordered same lengths different", async function () {
    // Act
    const result = areArraysEqualUnordered(["a", "b"], ["c", "d"]);

    // Assert
    chai.expect(result).to.be.false;
  });

  it("areArraysEqualUnordered different lengths", async function () {
    // Act
    const result = areArraysEqualUnordered(["a", "b"], ["c"]);

    // Assert
    chai.expect(result).to.be.false;
  });
});
