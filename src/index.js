import React from 'react';
import ReactDOM from 'react-dom';

const parseAttribute = (value) => {
  try {
    // try to parse attribute values as JSON, e.g.
    // - "1" -> 1
    // - "true" -> true
    // - "null" -> null
    // - "[1, null, \"foo\"]" -> [1, null, 'foo']
    return JSON.parse(value);
  } catch (err) {
    // or just return the raw value as string
    return value;
  }
};

// ATTENTION: all attribute names are lowercase in HTML, always!
const convertAttributes = (node, attributeNames) =>
  attributeNames.reduce((obj, name) => {
    const value = node.getAttribute(name.toLowerCase());

    return ({ ...obj, [name]: parseAttribute(value) });
  }, {});

const convertEvents = (node, eventNames) =>
  eventNames.reduce((obj, name) => {
    const value = node.getAttribute(name);

    return ({
      ...obj,
      [name](data) {
        const domEvent = new Event(name, { bubbles: true });
        domEvent.data = data;
        node.dispatchEvent(domEvent);

        if (value) {
          try {
            eval(value);
          } catch (err) {
            console.error(err);
          }
        }
      },
    });
  }, {});

const convertChildren = innerHTML =>
  innerHTML.trim() !== ''
    ? <div dangerouslySetInnerHTML={{__html: innerHTML }} />
    : null;

export function register(ReactComponent, tagName, { attributes, events } = {}) {
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
      const props = {
        ...convertAttributes(this, attributes),
        ...convertEvents(this, events),
      };

      ReactDOM.render(
        React.createElement(
          ReactComponent,
          props,
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
