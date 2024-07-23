"use strict";

import { createRequire } from "module";
const require = createRequire(import.meta.url);

import { beforeEach, afterEach, describe, it } from "mocha";
const chai = require('chai');
const spies = require('chai-spies');
chai.use(spies);

const sandbox = chai.spy.sandbox();

import { createEvent } from "./_mocks/event.js";
import { api } from "./_mocks/api.js";
import { setupApiSpy } from "./_helpers/setupApiSpy.js";
import { convert } from "../src/RuleToAction.mjs"

let event;

describe('RuleToAction', function () {

    beforeEach(function () {
        // reset Auth0 event
        event = createEvent();
        // spy on all Auth0 api methods
        setupApiSpy(sandbox, api);
    });

    afterEach(function () {
        sandbox.restore();
    });

    describe('using rules', function() {
        it('denies access for rule that throws error', async function () {
            // Prepare
            let rule = function (user, context, callback) {
                return callback(
                    new UnauthorizedError("This app is unavailable")
                );
            }
            let context = {};
    
            // Act
            await convert(event, api, rule, context);
    
            // Assert
            chai.expect(api.access.deny).to.have.been.called.with("This app is unavailable");
        });

        it('converts exampleRule rule', async function () {
            // Prepare
            let rule = function exampleRule(user, context, callback) {
                // ID and Access token claims
                context.idToken["https://example.com/testIDToken"] = "testIDTokenValue";
                context.accessToken["https://example.com/testAccessToken"] = "testAccessTokenValue";
                // SAML
                context.samlConfiguration.mappings = {
                  'https://example.com/SAML/Attributes/Role': 'role',
                  'https://example.com/SAML/Attributes/RoleSessionName': 'session'
                };
                
                callback(null, user, context);
            }
            let context = {};
    
            // Act
            await convert(event, api, rule, context);
    
            // Assert
            chai.expect(api.idToken.setCustomClaim).to.have.been.called.with("https://example.com/testIDToken", "testIDTokenValue");
            chai.expect(api.accessToken.setCustomClaim).to.have.been.called.with("https://example.com/testAccessToken", "testAccessTokenValue");
            chai.expect(api.samlResponse.setAttribute).to.have.been.called.with("https://example.com/SAML/Attributes/Role", "role");
            chai.expect(api.samlResponse.setAttribute).to.have.been.called.with("https://example.com/SAML/Attributes/RoleSessionName", "session");
        });
    })
});