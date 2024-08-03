### Example Post Login action

```javascript
const RuleToAction = require("auth0-rule-as-action");

/**
 * The Rule
 */
function accessOnWeekdaysOnly(user, context, callback) {
  // ID and Access token claims
  context.idToken["https://example.com/testIDToken"] = "testIDTokenValue";
  context.accessToken["https://example.com/testAccessToken"] = "testAccessTokenValue";
  // SAML
  context.samlConfiguration.mappings = {
    'https://example.com/SAML/Attributes/Role': 'role',
    'https://example.com/SAML/Attributes/RoleSessionName': 'session'
  };
  
  if (context.clientName === 'All Applications') {
    const date = new Date();
    const d = date.getDay();

    if (d === 0 || d === 6) {
      return callback(
        new UnauthorizedError('This app is available during the week')
      );
    }
  }

  callback(null, user, context);
}

/**
 * Handler that will be called during the execution of a PostLogin flow.
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
  const rule = accessOnWeekdaysOnly;
  await RuleToAction.convert(event, api, rule);
};
```

### Customizing Rule Callback

The following is an example on how to use a custom Rule callback. It adds the ability to handle redirects applied to context.

```javascript
const RuleToAction = require("auth0-rule-as-action");

/**
 * The Rule
 */
function simpleRedirectRule(user, context, callback) {
  context.redirect = {
    url: "https://example.com/foo"
  };
  callback(null, user, context);
}

exports.onExecutePostLogin = async (event, api) => {
  const rule = simpleRedirectRule;

  // Custom rule callback
  const customRuleCallback = async (obj, newUser, newContext) => {
    if (obj === null) {
      // Handle Redirect
      if (newContext.redirect?.url) {
        api.redirect.sendUserTo(newContext.redirect.url);
      }
    }
    // Call default rule callback
    await RuleToAction.defaultRuleCallback(obj, newUser, newContext);
  }

  await RuleToAction.convert(event, api, rule, {
    callback: customRuleCallback
  });
};
```

[Back to README.md](../README.md)