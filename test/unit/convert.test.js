"use strict";

import { beforeEach, afterEach, describe, it } from "mocha";
import { chai } from "../chai.config.js";
const sandbox = chai.spy.sandbox();

import { api } from "../_mocks/api.js";
import { setupApiSpy } from "../_helpers/setupApiSpy.js";
import RuleToAction from "../../src/RuleToAction.mjs";

describe('convert unit', function () {

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
    const converter = new RuleToAction(api);

		// Act
		await converter.defaultRuleCallback(obj, newUser, newContext);

		// Assert
		chai.expect(api.access.deny).to.have.been.called.with(obj.message);
	});

	it('defaultRuleCallback handle redirect', async function () {
		// Prepare
		let newUser, newContext;
		// set redirect
		newContext = {}
		newContext.redirect = {};
		newContext.redirect.url = "example.com/foo";

		// set api on rule conversion globals
		const converter = new RuleToAction(api);

		// Act
		await converter.defaultRuleCallback(null, newUser, newContext);

		// Assert
		chai.expect(api.redirect.sendUserTo).to.have.been.called.with("example.com/foo");
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

    // set api on rule conversion globals
		const converter = new RuleToAction(api);
    converter.convertGlobals = convertGlobals;

		// Act
		// success, callback(null, user, context);
		await converter.defaultRuleCallback(null, newUser, newContext);

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

    const converter = new RuleToAction(api);
    converter.convertGlobals = convertGlobals;

		// Get
		const recievedConvertGlobals = converter.getConvertGlobals();

		// Assert
		chai.expect(recievedConvertGlobals).to.deep.equal(convertGlobals);
	});
});