### Example Post Login action

```javascript
const RuleToAction = require("auth0-rule-as-action");

/**
 * The Rule
 */
function exampleRule(user, context, callback) {
  // ID and Access token claims
  context.idToken["https://example.com/testIDToken"] = "testIDTokenValue";
  context.accessToken["https://example.com/testAccessToken"] =
    "testAccessTokenValue";
  // SAML
  context.samlConfiguration.mappings = {
    "https://example.com/SAML/Attributes/Role": "role",
    "https://example.com/SAML/Attributes/RoleSessionName": "session",
  };
  context.samlConfiguration.lifetimeInSeconds = 3600;
  // Multifactor
  context.multifactor = {
    provider: "any",
    allowRememberBrowser: false,
  };

  if (context.clientName === "All Applications") {
    const date = new Date();
    const d = date.getDay();

    if (d === 0 || d === 6) {
      return callback(
        new UnauthorizedError("This app is available during the week"),
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
  const rule = exampleRule;
  const converter = new RuleToAction(api);
  await converter.convert(event, rule);
};
```

### Customizing Rule Callback

The following is an example on how to use a custom Rule callback, which adds the ability to handle redirects applied to context.
This is just an example, as redirects are already supported by default.

```javascript
const RuleToAction = require("auth0-rule-as-action");

/**
 * The Rule
 */
function simpleRedirectRule(user, context, callback) {
  context.redirect = {
    url: "https://example.com/foo",
  };
  callback(null, user, context);
}

exports.onExecutePostLogin = async (event, api) => {
  const rule = simpleRedirectRule;

  // Instantiate a Rule to Action converter
  const converter = new RuleToAction(api);

  // Custom rule callback
  const customRuleCallback = async (obj, newUser, newContext) => {
    if (obj === null) {
      // Handle Redirect
      if (newContext.redirect?.url) {
        api.redirect.sendUserTo(newContext.redirect.url);
      }
    }
    // Call default rule callback
    await converter.defaultRuleCallback(obj, newUser, newContext);
  };

  // Run the Rule as an Action using the custom rule callback
  await converter.convert(event, rule, {
    callback: customRuleCallback,
  });
};
```

[Back to README.md](../README.md)
