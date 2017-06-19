# Web React Components

Put your React Components into a neat Web components wrapper and render them
anywhere not just in your react code.

## Motivation

We has lot of React code and really wanted to write Elm. Putting React inside Elm
is not trivial and not being able to use our tried-and-tested components
would have been a big reason to use Elm.
So after watching Richard Feldman's [talk](https://www.youtube.com/watch?v=ar3TakwE8o0)
we thought "what if Elm rendered just Web Components and the web components render
whatever they want inside(in our case React)". So how to convert all of our React
components into Web Components? Well, that is what this repo is for.

## Dependencies

This package requires the following dependencies:

Polyfills:
These polyfills are needed polyfills to work in all evergreen browsers(including IE11)

- Polyfills for Web Components features, namely custom elements(CE) and shady DOM(SD)
- Adapter to transform non-native ES2015 classes into true ES2015 classes(needed for CE)
- Everything you need to provide an ES2015 environment in the browser

Libraries:
- React (globally available)
- ReactDOM (globally available)

To get started quickly just drop these script tags into your page. They should
contain all of the above dependencies.

```html
<script src="//cdn.polyfill.io/v2/polyfill.min.js?features=default,fetch,es6,Array.prototype.includes"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/webcomponentsjs/1.0.1/custom-elements-es5-adapter.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/webcomponentsjs/1.0.1/webcomponents-sd-ce.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/0.14.8/react-with-addons.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/0.14.8/react-dom.js"></script>
```

## Usage

```sh
npm install -S web-react-components
```
(NOT YET PUBLISHED)

Then in your code import the registering function

```js
import React from 'react';
// import the registering function
import register from 'web-react-components';

const YourComponents = ({ name, onButtonClick }) => (
  <button onClick={onButtonClick}>
    {`Hello ${name}, please click me`}
  </button>
);

// call it to register the web component
// this will transform all <your-component>-tags in the markup
// use it anywhere like this:
// <your-component name="Peter" onClick="console.log('hello')"></your-component>
register('your-component', YourComponent);
```

## Passing props

### Attributes
Since in HTML your can only pass strings in you attributes, that's all you can pass
here. However, your components will try a JSON parse on each attribute so all
JSON values are valid inside the string. Example: passing '{ "name": Peter }' is fine.
Just make sure your properly escape it if necessary. You can also use JS to pass
properties like this:
```js
document.getElementById('your-dom-id').numbers = [1, 2, 3, 4];
```

### Events
TODO

### Children
TODO

## How does it work under the hood?

???

## Example

You can see an example [here](https://github.com/ChristophP/web-react-components/blob/master/dev-assets/index.html).
You can also clone the repo and run `npm i` and `npm start`.
Open your browser at `http://localhost:8080`

