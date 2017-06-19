import React from 'react';
import ReactDOM from 'react-dom';
import CustomEvent from './custom-event-ponyfill';

const Types = {
  bool: 'bool',
  number: 'number',
  string: 'string',
  json: 'json',
  event: 'event',
};

const mapAttributeToProp = (node, name) => node[name];

const mapEventToProp = (node, name) => {
  // accessing properties instead of attributes here
  // (autom. attribute parsing)
  const handler = node[name];

  return (...origArgs) => {
    // dispatch DOM event
    const domEvent = new CustomEvent(name, {
      bubbles: true,
      cancelable: true,
      detail: origArgs, // store original arguments from handler
    });
    node.dispatchEvent(domEvent);

    // call event handler if defined
    if (typeof handler === 'function') {
      handler.call(node, domEvent);
    }
  };
};

const mapToProps = (node, mapping) =>
  Object.keys(mapping).reduce((props, name) => {
    const typeOrSerDes = mapping[name];
    const mapFunc = (typeOrSerDes === Types.event)
      ? mapEventToProp
      : mapAttributeToProp;
    const value = mapFunc(node, name);

    return { ...props, [name]: value };
  }, {});

const mapToPropertyDescriptor = (
  name,
  typeOrSerDes,
) => {
  // handlers
  if (typeOrSerDes === Types.event) {
    return {
      get() {
        // return event handler assigned via propery if available
        if (typeof eventHandler !== 'undefined') return eventHandler;

        // return null if event handler attribute wasn't defined
        const value = this.getAttribute(name);
        if (value === null) return null;

        // try to return a function representation of the event handler attr.
        try {
          return new Function(value);
        } catch (err) {
          return null;
        };
      },
      set(value) {
        this[name] = (typeof value === 'function') ? value : null;
      }
    };
  }

  // booleans
  if (typeOrSerDes === Types.bool) {
    return {
      get() {
        return this.hasAttribute(name);
      },
      set(value) {
        if (value) {
          this.setAttribute(name, '');
          return;
        }

        this.removeAttribute(name);
      }
    };
  }

  // string, numbers, json
  return {
    get() {
      const value = this.getAttribute(name);

      if (typeOrSerDes === Types.number) {
        return Number(value);
      }

      if (typeOrSerDes === Types.json) {
        return JSON.parse(value);
      }

      return (typeof typeOrSerDes.deserialize === 'function')
        ? typeOrSerDes.deserialize(value)
        : value;
    },
    set(value) {
      const attributeValue = (() => {
        if (typeOrSerDes === Types.json) {
          return JSON.stringify(value);
        }

        return (typeof typeOrSerDes.serialize === 'function')
          ? typeOrSerDes.serialize(value)
          : value.toString();
      })();

      this.setAttribute(name, attributeValue);
    }
  };
};

const definePropertiesFor = (WebComponent, mapping) => {
  Object.keys(mapping).forEach((name) => {
    const typeOrSerDes = mapping[name];

    Object.defineProperty(
      WebComponent.prototype,
      name,
      mapToPropertyDescriptor(name, typeOrSerDes)
    );
  });
};

function register(ReactComponent, tagName, mapping = {}) {
  const attributeNames = Object.keys(mapping).map(name => name.toLowerCase());

  // render should be private
  const render = (component) => {
    const props = mapToProps(component, mapping);

    ReactDOM.render(
      React.createElement(ReactComponent, props, <slot></slot>),
      component.shadowRoot
    );
  };

  class WebReactComponent extends HTMLElement {
    static get observedAttributes() {
      return attributeNames;
    }

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
      render(this);
    }

    attributeChangedCallback() {
      render(this);
    }

    disconnectedCallback() {
      ReactDOM.unmountComponentAtNode(this.shadowRoot);
    }
  }

  // dynamically create property getters and setters for attributes
  // and event handlers
  definePropertiesFor(WebReactComponent, mapping);

  return customElements.define(tagName, WebReactComponent);
}

export default {
  register,
  Types,
};

export {
  register,
  Types,
};

