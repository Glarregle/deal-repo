# tiny-repos

[https://heartfelt-bunny-ddf2a8.netlify.app/](https://heartfelt-bunny-ddf2a8.netlify.app/)

<br>

This README outlines the concepts of the design of this Ember application.

## Composability

Is structured around reusable components that encapsulates specific logic or UI.

By using contextual components that yield actions and data, we leverage glimmer features and the specific logic, in a way that is highly composable, flexible and reusable, template or application-wide.

## Provider components

The application uses "provider" components, which act as providers for the child components. This approach separates concerns, decoupling data fetching from presentation logic.

## Declarative Rendering

The application uses a declarative rendering approach to simplify UI logic. Without having to manually manipulate the DOM we instead declare how the UI should look according to data state.

## Leverage QP

In `/organization` route, we leverage query params (and localStorage) to be able to reload the page or land in it through a different tab, maintaining state.

## API centralized

Adapter and serializer are utilized to centralize API logic, (namespace, headers, data normalization) and align with Ember Data conventions.

## Model layer

Even though the application is not really making use of the `store` this would become relevant when we want to share data accross the application, get the same record from different routes, leverage model updating, making it a unified source of information.

## Installation

- `git clone <repository-url>` this repository
- `cd tiny-repos`
- `npm install`

## Running / Development

- `ember serve`
- Visit your app at [http://localhost:4200](http://localhost:4200).
- Visit your tests at [http://localhost:4200/tests](http://localhost:4200/tests).

## Further Reading / Useful Links

- [ember.js](https://emberjs.com/)
- [ember-cli](https://cli.emberjs.com/release/)
- Development Browser Extensions
  - [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  - [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
