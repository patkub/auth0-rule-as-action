# auth0-rule-as-action

Run an Auth0 Rule as an Action

📦 NPM: https://www.npmjs.com/package/auth0-rule-as-action

## How this works

This library can be used in an Auth0 Post-Login action to run old Rules as Actions.

The basic workflow is as follows:

- Derives old user and context objects from the event object
- Runs the rule, which mutates the context object
- Makes api calls based on changes to the context object

## Example

### Add as dependency to a Post Login action

```
auth0-rule-as-action@latest
```

### Example Post Login action

```javascript
const RuleToAction = require("auth0-rule-as-action");

/**
 * The Rule
 */
function accessOnWeekdaysOnly(user, context, callback) {
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
  const rule = accessOnWeekdaysOnly;
  // Instantiate a Rule to Action converter
  const converter = new RuleToAction(api);
  // Run the Rule as an Action
  await converter.convert(event, rule);
};
```

## Options

Pass in custom methods for conversion process.

```javascript
const converter = new RuleToAction(api);
await converter.convert(event, rule, {
  // Rule callback() method
  callback: converter.defaultRuleCallback,
  // Maps Post-Login action Event variables to Rules Context variables
  mapEventToContext: converter.mapEventToContext,
});
```

## Currently supported features

- `callback` method with success and error
- Secrets
- Redirect urls
- ID and Access token claims
- SAML configuration mappings
- Multifactor triggering

```diff
-return callback(new UnauthorizedError("This app is unavailable"));
+api.access.deny("This app is unavailable");

-context.redirect = { url: "https://example.com/foo" };
+api.redirect.sendUserTo("https://example.com/foo");

-context.idToken["claim"] = "value";
+api.idToken.setCustomClaim(claim, value);

-context.accessToken["claim"] = "value";
+api.accessToken.setCustomClaim(claim, value);

-context.samlConfiguration.mappings["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] = "upn";
+api.samlResponse.setAttribute("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier", "upn");

-context.samlConfiguration.lifetimeInSeconds = 3600;
+api.samlResponse.setLifetimeInSeconds(3600);

-context.multifactor = { provider: "any", allowRememberBrowser: false };
+api.multifactor.enable("any", { allowRememberBrowser: false });
```

## Docs

- Explanation of available [npm scripts](./docs/scripts.md).
- See [more examples](./docs/examples.md).
