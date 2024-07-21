"use strict";

import { createRequire } from "module";
const require = createRequire(import.meta.url);

import { beforeEach, afterEach, describe, it } from "mocha";
const chai = require('chai');
const spies = require('chai-spies');
chai.use(spies);

const sandbox = chai.spy.sandbox();

import { api } from "./_mocks/api.js";
import { setupApiSpy } from "./_helpers/setupApiSpy.js";
import { defaultRuleCallback, getConvertGlobals, setConvertGlobals } from "../src/convert.mjs"

describe('convert', function () {

    beforeEach(function () {
        // spy on all Auth0 api methods
        setupApiSpy(sandbox, api);
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('defaultRuleCallback denies login on error', async function () {
        // Prepare
        let obj, newUser, newContext;
        // set error
        let errorMsg = "deny login on error";
        obj = new Error(errorMsg);

        // set api on rule conversion globals
        let convertGlobals = {};
        convertGlobals.api = api;
        setConvertGlobals(convertGlobals);

        // Act
        await defaultRuleCallback(obj, newUser, newContext);

        // Assert
        chai.expect(api.access.deny).to.have.been.called.with(obj.message);
    });

    it('setConvertGlobals sets globals for Rule', async function () {
        // Act - Set
        const convertGlobals = {};
        convertGlobals.api = api;
        convertGlobals.context = {};
        setConvertGlobals(convertGlobals);

        // Get
        const recievedConvertGlobals = getConvertGlobals();

        // Assert
        chai.expect(recievedConvertGlobals).to.deep.equal(convertGlobals);
    });

});