import React from 'react';
import ReactDOM from 'react-dom';

const parseAttribute = ({ name, value }) => {
  // treat on... attribute values as code, like with e.g. native onclick
  if (name.match(/on.+/)) {
    return () => eval(value); // yes, that's evil ... like the native ones ;)
  }

  try {
    // try to parse attribute values as JSON, e.g.
    // - "1" -> 1
    // - "true" -> true
    // - "null" -> null
    // - "[1, null, \"foo\"]" -> [1, null, 'foo']
    return JSON.parse(value);
  } catch (err) {
    // convert attribute values like "foo,1,baz" to ['foo', '1', 'baz']
    const values = value.split(',');
    if (values.length > 1) return values;

    // or just return the raw value as string
    return value;
  }
};

// ATTENTION: all attribute names are lowercase in HTML, always!
const convertAttributes = attributes =>
  [].slice.call(attributes)
    .reduce((obj, attr) =>
      ({ ...obj, [attr.name]: parseAttribute(attr) }),
      {}
    );

const convertChildren = innerHTML =>
  innerHTML.trim() !== ''
    ? <div dangerouslySetInnerHTML={{__html: innerHTML }} />
    : null;

export function register(ReactComponent, tagName) {
  class WebReactComponent extends HTMLElement {
    attachedCallback() {
      this._origInnerHTML = this.innerHTML;
      this.renderElement();
    }

    attributeChangedCallback() {
      this.renderElement();
    }

    detachedCallback() {
      ReactDOM.unmountComponentAtNode(this);
    }

    renderElement() {
      ReactDOM.render(
        React.createElement(
          ReactComponent,
          convertAttributes(this.attributes),
          // FIXME: orig children cannot change later by external (non React)
          // DOM manipulation
          convertChildren(this._origInnerHTML),
        ),
        this,
      );
    }
  }

  return document.registerElement(tagName, WebReactComponent);
}
