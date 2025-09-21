"use strict";

import { beforeEach, afterEach, describe, it } from "mocha";
import { chai } from "../chai.config.js";
const sandbox = chai.spy.sandbox();

import { api } from "../_mocks/api.js";
import { setupApiSpy } from "../_helpers/setupApiSpy.js";
import RuleToAction from "../../src/RuleToAction.mjs";

describe("unit::convert", function () {
  beforeEach(function () {
    // spy on all Auth0 api methods
    setupApiSpy(sandbox, api);
  });

  afterEach(function () {
    sandbox.restore();
  });

  it("defaultRuleCallback denies login on error", async function () {
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

  it("defaultRuleCallback handle redirect", async function () {
    // Prepare
    let newUser, newContext;
    // set redirect
    newContext = {};
    newContext.redirect = {};
    newContext.redirect.url = "example.com/foo";

    // set api on rule conversion globals
    const converter = new RuleToAction(api);

    // Act
    await converter.defaultRuleCallback(null, newUser, newContext);

    // Assert
    chai
      .expect(api.redirect.sendUserTo)
      .to.have.been.called.with("example.com/foo");
  });

  it("defaultRuleCallback handles context changes on success", async function () {
    // Prepare
    let newUser, newContext;

    // set api on rule conversion globals
    let convertGlobals = {
      api: api,
      oldContext: {
        idToken: {},
        accessToken: {},
        samlConfiguration: {
          mappings: {},
          nameIdentifierProbes: [],
        },
      },
    };

    newContext = {
      idToken: {
        mockIDTokenClaim: "mockIDTokenValue",
      },
      accessToken: {
        mockAccessTokenClaim: "mockAccessTokenValue",
      },
      samlConfiguration: {
        mappings: {
          mockSAMLClaim: "mockSAMLValue",
        },
        audience: "mockAudience",
        issuer: "mockIssuer",
        encryptionPublicKey: "mockEncryptionPublicKey",
        recipient: "mockRecipient",
        createUpnClaim: true,
        passthroughClaimsWithNoMapping: true,
        mapUnknownClaimsAsIs: true,
        mapIdentities: true,
        destination: "mockDestination",
        relayState: "mockRelayState",
        lifetimeInSeconds: 3600,
        signResponse: true,
        nameIdentifierFormat: "mockNameIdentifierFormat",
        nameIdentifierProbes: ["email", "username"],
        authnContextClassRef: "mockAuthnContextClassRef",
        signingCert: "mockSigningCert",
        includeAttributeNameFormat: true,
        encryptionCert: "mockEncryptionCert",
        cert: "mockCert",
        key: "mockKey",
      },
      multifactor: {
        provider: "any",
        allowRememberBrowser: false,
      },
    };

    // set api on rule conversion globals
    const converter = new RuleToAction(api);
    converter.convertGlobals = convertGlobals;

    // Act
    // success, callback(null, user, context);
    await converter.defaultRuleCallback(null, newUser, newContext);

    // Assert
    chai
      .expect(api.idToken.setCustomClaim)
      .to.have.been.called.with("mockIDTokenClaim", "mockIDTokenValue");
    chai
      .expect(api.accessToken.setCustomClaim)
      .to.have.been.called.with("mockAccessTokenClaim", "mockAccessTokenValue");
    chai
      .expect(api.samlResponse.setAttribute)
      .to.have.been.called.with("mockSAMLClaim", "mockSAMLValue");
    chai
      .expect(api.samlResponse.setAudience)
      .to.have.been.called.with("mockAudience");
    chai
      .expect(api.samlResponse.setIssuer)
      .to.have.been.called.with("mockIssuer");
    chai
      .expect(api.samlResponse.setEncryptionPublicKey)
      .to.have.been.called.with("mockEncryptionPublicKey");
    chai
      .expect(api.samlResponse.setRecipient)
      .to.have.been.called.with("mockRecipient");
    chai
      .expect(api.samlResponse.setCreateUpnClaim)
      .to.have.been.called.with(true);
    chai
      .expect(api.samlResponse.setPassthroughClaimsWithNoMapping)
      .to.have.been.called.with(true);
    chai
      .expect(api.samlResponse.setMapUnknownClaimsAsIs)
      .to.have.been.called.with(true);
    chai
      .expect(api.samlResponse.setMapIdentities)
      .to.have.been.called.with(true);
    chai
      .expect(api.samlResponse.setDestination)
      .to.have.been.called.with("mockDestination");
    chai
      .expect(api.samlResponse.setRelayState)
      .to.have.been.called.with("mockRelayState");
    chai
      .expect(api.samlResponse.setLifetimeInSeconds)
      .to.have.been.called.with(3600);
    chai
      .expect(api.samlResponse.setSignResponse)
      .to.have.been.called.with(true);
    chai
      .expect(api.samlResponse.setNameIdentifierFormat)
      .to.have.been.called.with("mockNameIdentifierFormat");
    chai
      .expect(api.samlResponse.setNameIdentifierProbes)
      .to.have.been.called.with(["email", "username"]);
    chai
      .expect(api.samlResponse.setAuthnContextClassRef)
      .to.have.been.called.with("mockAuthnContextClassRef");
    chai
      .expect(api.multifactor.enable)
      .to.have.been.called.with("any", { allowRememberBrowser: false });
  });

  it("defaultRuleCallback handles different length samlConfiguration nameIdentifierProbes", async function () {
    // Prepare
    let newUser, newContext;

    // set api on rule conversion globals
    let convertGlobals = {
      api: api,
      oldContext: {
        idToken: {},
        accessToken: {},
        samlConfiguration: {
          mappings: {},
          nameIdentifierProbes: ["email"],
        },
      },
    };

    newContext = {
      samlConfiguration: {
        mappings: {},
        nameIdentifierProbes: ["email", "username"],
      },
    };

    // set api on rule conversion globals
    const converter = new RuleToAction(api);
    converter.convertGlobals = convertGlobals;

    // Act
    // success, callback(null, user, context);
    await converter.defaultRuleCallback(null, newUser, newContext);

    // Assert
    chai
      .expect(api.samlResponse.setNameIdentifierProbes)
      .to.have.been.called.with(["email", "username"]);
  });

  it("defaultRuleCallback handles different value samlConfiguration nameIdentifierProbes", async function () {
    // Prepare
    let newUser, newContext;

    // set api on rule conversion globals
    let convertGlobals = {
      api: api,
      oldContext: {
        idToken: {},
        accessToken: {},
        samlConfiguration: {
          mappings: {},
          nameIdentifierProbes: ["email"],
        },
      },
    };

    newContext = {
      samlConfiguration: {
        mappings: {},
        nameIdentifierProbes: ["username"],
      },
    };

    // set api on rule conversion globals
    const converter = new RuleToAction(api);
    converter.convertGlobals = convertGlobals;

    // Act
    // success, callback(null, user, context);
    await converter.defaultRuleCallback(null, newUser, newContext);

    // Assert
    chai
      .expect(api.samlResponse.setNameIdentifierProbes)
      .to.have.been.called.with(["username"]);
  });

  it("defaultRuleCallback handles same samlConfiguration nameIdentifierProbes", async function () {
    // Prepare
    let newUser, newContext;

    // set api on rule conversion globals
    let convertGlobals = {
      api: api,
      oldContext: {
        idToken: {},
        accessToken: {},
        samlConfiguration: {
          mappings: {},
          nameIdentifierProbes: ["email", "username"],
        },
      },
    };

    newContext = {
      samlConfiguration: {
        nameIdentifierProbes: ["email", "username"],
      },
    };

    // set api on rule conversion globals
    const converter = new RuleToAction(api);
    converter.convertGlobals = convertGlobals;

    // Act
    // success, callback(null, user, context);
    await converter.defaultRuleCallback(null, newUser, newContext);

    // Assert
    chai
      .expect(api.samlResponse.setNameIdentifierProbes)
      .to.not.have.been.called.with(["email", "username"]);
  });

  it("defaultRuleCallback handles empty context", async function () {
    // Prepare
    let newUser, newContext;

    // set api on rule conversion globals
    let convertGlobals = {
      api: api,
      oldContext: {},
    };

    newContext = {};

    // set api on rule conversion globals
    const converter = new RuleToAction(api);
    converter.convertGlobals = convertGlobals;

    // Act
    // success, callback(null, user, context);
    await converter.defaultRuleCallback(null, newUser, newContext);

    // Assert
    // should not call any api methods
    for (const key of Object.keys(api)) {
      for (const method of Object.keys(api[key])) {
        if (api[key][method] instanceof Function) {
          chai.expect(api[key][method]).to.not.have.been.called();
        }
      }
    }
  });

  it("setConvertGlobals sets globals for Rule", async function () {
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
