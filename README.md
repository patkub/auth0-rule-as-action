# auth0-rule-as-action

Run an Auth0 Rule as an Action

📦 NPM: https://www.npmjs.com/package/auth0-rule-as-action

## Experimental

This is an experiment with a very small feature set.

### Currently supported features
- `callback` method with success and error
- ID and Access token claims
- SAML configuration mappings

```diff
-context.idToken["claim"] = "value"
+api.idToken.setCustomClaim(claim, value)

-context.accessToken["claim"] = "value"
+api.accessToken.setCustomClaim(claim, value)

-context.samlConfiguration.mappings["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] = "upn";
+api.samlResponse.setAttribute("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier", "upn");
```

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

### Options
Pass custom Rule callback() method.
```javascript
await RuleToAction.convert(event, api, rule, {
  callback: RuleToAction.defaultRuleCallback
});
```