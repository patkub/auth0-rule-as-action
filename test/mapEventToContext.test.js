"use strict";

import { createRequire } from "module";
const require = createRequire(import.meta.url);

import { beforeEach, afterEach, describe, it } from "mocha";
const chai = require('chai');
const spies = require('chai-spies');
chai.use(spies);

const sandbox = chai.spy.sandbox();

import { createEvent } from "./_mocks/event.js"
import { MapEventToContext } from "../src/mapEventToContext.mjs"

let event;

describe('MapEventToContext', function () {

    beforeEach(function () {
        //...
        // reset Auth0 event
        event = createEvent();
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('maps event to context', async function () {
        // Prepare
        event.client.name = "Mocked App"
        
        // Act
        const context = MapEventToContext(event);

        // Assert
        chai.expect(context.tenant).to.equal(event.tenant.id);

    });

});