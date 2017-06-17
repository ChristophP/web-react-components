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

const mapAttributesToProps = (node, attributeNames) =>
  attributeNames.reduce((obj, name) => {
    // accessing node properties instead of node attributes here
    // (autom. attribute parsing)
    const value = node[name];

    // ignore missing node properties
    if (value === null) return obj;

    return { ...obj, [name]: value };
  }, {});

const mapEventsToProps = (node, eventNames) =>
  eventNames.reduce((obj, name) => {
    const value = node[name];

    return ({
      ...obj,
      [name](data) {
        // dispatch DOM event
        const domEvent = new Event(name, { bubbles: true });
        domEvent.data = data;
        node.dispatchEvent(domEvent);

        // call event handler if defined
        if (typeof value === 'function') {
          value.call(node, domEvent);
        }
      },
    });
  }, {});

export function register(ReactComponent, tagName, { attributes, events } = {}) {
  class WebReactComponent extends HTMLElement {
    static get observedAttributes() {
      return [...attributes, ...events];
    }

    constructor() {
      super();
      this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
      this.renderElement();
    }

    attributeChangedCallback() {
      this.renderElement();
    }

    disconnectedCallback() {
      ReactDOM.unmountComponentAtNode(this.shadowRoot);
    }

    renderElement() {
      const props = {
        ...mapAttributesToProps(this, attributes),
        ...mapEventsToProps(this, events),
      };

      ReactDOM.render(
        React.createElement(
          ReactComponent,
          props,
          <slot></slot>
        ),
        this.shadowRoot,
      );
    }
  }

  // dynamically create property getters and setters for attributes
  attributes.forEach(propName =>
    Object.defineProperty(WebReactComponent.prototype, propName, {
      get: function() {
        const value = this.getAttribute(propName);
        return parseAttribute(value);
      },
      set: function(value) {
        this.setAttribute(propName, value);
      }
    })
  );

  // dynamically create property getters and setters for event handlers
  events.forEach(propName => {
    let eventHandler;

    Object.defineProperty(WebReactComponent.prototype, propName, {
      get: function() {
        // return event handler assigned via propery if available
        if (typeof eventHandler !== 'undefined') return eventHandler;

        // return null if event handler attribute wasn't defined
        const value = this.getAttribute(propName);
        if (value === null) return null;

        // try to return a function representation of the event handler attr.
        try {
          return new Function(value);
        } catch (err) {
          return null;
        };
      },
      set: function(value) {
        eventHandler = (typeof value === 'function') ? value : null;
        this.renderElement(); // trigger manually because no attr. was changed
      }
    })
  });

  return customElements.define(tagName, WebReactComponent);
}
