"use strict";

import { beforeEach, afterEach, describe, it } from "mocha";
import { chai } from "./chai.config.js";
const sandbox = chai.spy.sandbox();

import { createEvent } from "./_mocks/event.js";
import { api } from "./_mocks/api.js";
import { setupApiSpy } from "./_helpers/setupApiSpy.js";
import { convert, defaultRuleCallback, getConvertGlobals, setConvertGlobals } from "../src/convert.mjs"
import { UnauthorizedError } from "../src/init.mjs"
import { mapEventToContext } from "../src/mapEventToContext.mjs";

let event;

describe('convert', function () {

    beforeEach(function () {
        // reset Auth0 event
        event = createEvent();
        // spy on all Auth0 api methods
        setupApiSpy(sandbox, api);
    });

    afterEach(function () {
        sandbox.restore();
    });

    describe('using mocks', function () {
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
    
        it('defaultRuleCallback handles context changes on success', async function () {
            // Prepare
            let newUser, newContext;
    
            // set api on rule conversion globals
            let convertGlobals = {
                api: api,
                oldContext: {
                    idToken: {},
                    accessToken: {},
                    samlConfiguration: {
                        mappings: {}
                    }
                }
            };
            convertGlobals.api = api;
            setConvertGlobals(convertGlobals);
    
            newContext = {
                idToken: {
                    mockIDTokenClaim: "mockIDTokenValue"
                },
                accessToken: {
                    mockAccessTokenClaim: "mockAccessTokenValue"
                },
                samlConfiguration: {
                    mappings: {
                        mockSAMLClaim: "mockSAMLValue"
                    }
                }
            }
    
            // Act
            // success, callback(null, user, context);
            await defaultRuleCallback(null, newUser, newContext);
    
            // Assert
            chai.expect(api.idToken.setCustomClaim).to.have.been.called.with("mockIDTokenClaim", "mockIDTokenValue");
            chai.expect(api.accessToken.setCustomClaim).to.have.been.called.with("mockAccessTokenClaim", "mockAccessTokenValue");
            chai.expect(api.samlResponse.setAttribute).to.have.been.called.with("mockSAMLClaim", "mockSAMLValue");
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

    describe('using rules', function() {
        it('converts empty rule with empty context', async function () {
            // Prepare
            let rule = function (user, context, callback) {
                // TODO: implement your rule
                return callback(null, user, context);
            }
            let context = {};
    
            // Act
            await convert(event, api, rule, context);
    
            // Assert
            // Instantiates global UnauthorizedError
            chai.expect(new global.UnauthorizedError()).to.be.an.instanceof(UnauthorizedError);
    
            // Get Rule conversion globals
            const recievedConvertGlobals = getConvertGlobals();
            // Maps event variable to context
            const expectedContext = mapEventToContext(event);
            chai.expect(recievedConvertGlobals.oldContext).to.deep.equal(expectedContext);
        });

    })
});