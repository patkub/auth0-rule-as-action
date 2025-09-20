"use strict";

import { beforeEach, afterEach, describe, it } from "mocha";
import { chai } from "../../chai.config.js";
const sandbox = chai.spy.sandbox();

import { createEvent } from "../../_mocks/event.js";
import { api } from "../../_mocks/api.js";
import { setupApiSpy } from "../../_helpers/setupApiSpy.js";
import { UnauthorizedError } from "../../../src/lib/init.mjs";
import RuleToAction from "../../../src/RuleToAction.mjs";

let event, activeDirectoryGroupsRule;

describe("activeDirectoryGroupsRule", function () {
  beforeEach(function () {
    // reset Auth0 event
    event = createEvent();
    // spy on all Auth0 api methods
    setupApiSpy(sandbox, api);

    /**
     * This rule checks if a user belongs to an AD group and if not, it will return Access Denied.
     *
     * > Note: you can mix this with `context.clientID` or `clientName` to do it only for specific application
     *
     * @title Active Directory group membership
     * @overview Check Active Directory membership, else return Access Denied.
     * @gallery true
     * @category access control
     */
    activeDirectoryGroupsRule = function activeDirectoryGroups(
      user,
      context,
      callback,
    ) {
      var groupAllowed = "group1";
      if (user.groups) {
        if (typeof user.groups === "string") {
          user.groups = [user.groups];
        }
        var userHasAccess = user.groups.some(function (group) {
          return groupAllowed === group;
        });

        if (!userHasAccess) {
          return callback(new UnauthorizedError("Access denied."));
        }
      }

      callback(null, user, context);
    };
  });

  afterEach(function () {
    sandbox.restore();
  });

  it("activeDirectoryGroupsRule allows users with group1", async function () {
    // Prepare
    // Has group1, allow
    event.user.groups = ["group1"];

    // Act
    const converter = new RuleToAction(api);
    await converter.convert(event, activeDirectoryGroupsRule);

    // Assert
    chai.expect(api.access.deny).to.not.have.been.called.with("Access denied.");
  });

  it("activeDirectoryGroupsRule denies users with group2", async function () {
    // Prepare
    // Doesn't have group1, deny
    event.user.groups = ["group2"];

    // Act
    const converter = new RuleToAction(api);
    await converter.convert(event, activeDirectoryGroupsRule);

    // Assert
    chai.expect(api.access.deny).to.have.been.called.with("Access denied.");
  });
});
