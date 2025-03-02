"use strict";

import { beforeEach, afterEach, describe, it } from "mocha";
import { chai } from "./chai.config.js";
const sandbox = chai.spy.sandbox();

import { createEvent } from "./_mocks/event.js";
import { mapEventToContext } from "../src/mapEventToContext.mjs";

let event;

describe('mapEventToContext', function () {

    beforeEach(function () {
        // reset Auth0 event
        event = createEvent();
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('maps event to context', async function () {
        // Act
        // defined context variables based on event varibles
        const context = mapEventToContext(event);

        // Assert
        // context variables have been defined based on event variables
        chai.expect(context.tenant).to.equal(event.tenant.id);
        chai.expect(context.clientID).to.equal(event.client.client_id);
        chai.expect(context.clientName).to.equal(event.client.name);
        chai.expect(context.clientMetadata).to.equal(event.client.metadata);
        chai.expect(context.connectionID).to.equal(event.connection.id);
        chai.expect(context.connection).to.equal(event.connection.name);
        chai.expect(context.connectionStrategy).to.equal(event.connection.strategy);
        chai.expect(context.connectionMetadata).to.equal(event.connection.metadata);
        chai.expect(context.protocol).to.equal(event.transaction?.protocol);
        chai.expect(context.riskAssessment).to.equal(event.riskAssessment);
        chai.expect(context.stats).to.equal(event.stats);
        chai.expect(context.request).to.equal(event.request);
        chai.expect(context.authentication).to.equal(event.authentication);
        chai.expect(context.authorization).to.equal(event.authorization);
        chai.expect(context.organization).to.equal(event.organization);
    });

});