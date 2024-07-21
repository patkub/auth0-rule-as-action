# auth0-rule-as-action

## NOTE: This is an experimental work-in-progress!

This is just a proof-of-concept and is barely useable in its current state.

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
  await RuleToAction.convert(event, api, rule, RuleToAction.ruleCallback);
};
```
