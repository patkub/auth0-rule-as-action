"use strict";

import { beforeEach, afterEach, describe, it } from "mocha";
import { chai } from "../../chai.config.js";
const sandbox = chai.spy.sandbox();

import { createEvent } from "../../_mocks/event.js";
import { api } from "../../_mocks/api.js";
import { setupApiSpy } from "../../_helpers/setupApiSpy.js";
import RuleToAction from "../../../src/RuleToAction.mjs";

let event, adaptiveMfaRule;

describe("adaptiveMfaRule", function () {
  beforeEach(function () {
    // reset Auth0 event
    event = createEvent();
    // spy on all Auth0 api methods
    setupApiSpy(sandbox, api);

    /**
     *
     * This rule is used to trigger multifactor authentication when a specific risk assessment result is detected.
     *
     * The `context.riskAssessment` attribute will be available only when Adaptive MFA is enabled for your tenant. Use of the Adaptive MFA feature requires an add-on for the Enterprise plan. Please contact sales with any questions.
     *
     * For more information about Adaptive MFA and the `context.riskAssessment` attribute, read our [full documentation](https://auth0.com/docs/mfa/adaptive-mfa).
     *
     * @title Adaptive MFA
     * @overview Trigger multifactor authentication for a specific risk assessment result.
     * @gallery true
     * @category multifactor
     */
    adaptiveMfaRule = function adaptiveMfa(user, context, callback) {
      /*
       * This rule is used to trigger multifactor authentication when a specific risk assessment result is detected.
       *
       * Use of this rule is recommended when end users are already enrolled in MFA and you wish to trigger MFA
       * based on contextual risk.
       *
       * The `context.riskAssessment` attribute will be available only when Adaptive MFA is enabled for your tenant. Use of
       * the Adaptive MFA feature requires an add-on for the Enterprise plan. Please contact sales with any questions.
       *
       * For more information about Adaptive MFA and the `context.riskAssessment` attribute, read our full documentation
       * at https://auth0.com/docs/mfa/adaptive-mfa.
       */
      const riskAssessment = context.riskAssessment;

      // Example condition: prompt MFA only based on the NewDevice confidence level, this will prompt for MFA when a user is logging in from an unknown device.
      let shouldPromptMfa;
      switch (riskAssessment.assessments.NewDevice.confidence) {
        case "low":
        case "medium":
          shouldPromptMfa = true;
          break;
        case "high":
          shouldPromptMfa = false;
          break;
        case "neutral":
          // When this assessor has no useful information about the confidence, do not prompt MFA.
          shouldPromptMfa = false;
          break;
      }

      // It only makes sense to prompt for MFA when the user has at least one enrolled MFA factor.
      // Use of this rule is only recommended when end users are already enrolled in MFA.
      const userEnrolledFactors = user.multifactor || [];
      const canPromptMfa = userEnrolledFactors.length > 0;

      if (shouldPromptMfa && canPromptMfa) {
        context.multifactor = {
          provider: "any",
          // ensure that we will prompt MFA, even if the end-user has selected to remember the browser.
          allowRememberBrowser: false,
        };
      }

      callback(null, user, context);
    };
  });

  afterEach(function () {
    sandbox.restore();
  });

  it("adaptiveMfaRule prompts MFA for medium new device confidence", async function () {
    // Prepare
    event.authentication.riskAssessment.assessments.NewDevice.confidence =
      "medium";
    event.user.multifactor = ["guardian"];

    // Act
    const converter = new RuleToAction(api);
    await converter.convert(event, adaptiveMfaRule);

    // Assert
    chai
      .expect(api.multifactor.enable)
      .to.have.been.called.with("any", { allowRememberBrowser: false });
  });

  it("adaptiveMfaRule skips MFA for high new device confidence", async function () {
    // Prepare
    event.authentication.riskAssessment.assessments.NewDevice.confidence =
      "high";
    event.user.multifactor = ["guardian"];

    // Act
    const converter = new RuleToAction(api);
    await converter.convert(event, adaptiveMfaRule);

    // Assert
    chai
      .expect(api.multifactor.enable)
      .to.not.have.been.called.with("any", { allowRememberBrowser: false });
  });
});
