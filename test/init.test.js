"use strict";

import { createRequire } from "module";
const require = createRequire(import.meta.url);

import { beforeEach, afterEach, describe, it } from "mocha";
const chai = require('chai');
const spies = require('chai-spies');
chai.use(spies);

const sandbox = chai.spy.sandbox();

import { init } from "../src/init.mjs"

describe('init', function () {

    beforeEach(function () {
        // reset global
        global = {};
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('initializes Rule globals', async function () {
        // Act
        const result = init();
        const unauthorizedError = new global.UnauthorizedError();

        // Assert
        chai.expect(result).to.be.undefined;
        chai.expect(unauthorizedError).to.be.an.instanceOf(Error);
        chai.expect(global.configuration).to.be.an("object").that.is.empty;
    });

});