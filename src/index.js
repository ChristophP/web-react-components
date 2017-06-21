import React from 'react';
import ReactDOM from 'react-dom';
import {
  pipe,
  isBoolConvention,
  isHandlerConvention,
  objectFromArray,
  mapObject,
  mapObjectKeys,
  sanitizeAttributeName,
  setBooleanAttribute,
} from './util';

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

const mapToProps = (node, mapping) => {
  const mapFunc = (typeOrSerDes, name) => (typeOrSerDes === Types.event
    ? mapEventToProp(node, name)
    : mapAttributeToProp(node, name)
  );
  return mapObject(mapFunc, mapping);
};

const mapToPropertyDescriptor = (
  name,
  typeOrSerDes,
) => {
  // handlers
  if (typeOrSerDes === Types.event) {
    let eventHandler;
    return {
      get() {
        // return event handler assigned via propery if available
        if (typeof eventHandler !== 'undefined') return eventHandler;

        // return null if event handler attribute wasn't defined
        const value = this.getAttribute(name);
        if (value === null) return null;

        // try to return a function representation of the event handler attr.
        try {
          // eslint-disable-next-line no-new-func
          return new Function(value);
        } catch (err) {
          return null;
        }
      },
      set(value) {
        eventHandler = (typeof value === 'function') ? value : null;
        this.attributeChangedCallback();
      },
    };
  }

  // booleans
  if (typeOrSerDes === Types.bool) {
    return {
      get() {
        return this.hasAttribute(name);
      },
      set(value) {
        setBooleanAttribute(this, name, value);
      },
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
        // handle boolean values
        if (value === '') return true;
        if (!this.hasAttribute(name)) return false;

        // try to parse as JSON
        try {
          return JSON.parse(value);
        } catch (e) {
          return value; // original string as fallback
        }
      }

      return (typeof typeOrSerDes.deserialize === 'function')
        ? typeOrSerDes.deserialize(value)
        : value;
    },
    set(value) {
      if (typeOrSerDes === Types.json && typeof value === 'boolean') {
        setBooleanAttribute(this, name, value);
        return;
      }

      const attributeValue = (() => {
        if (typeOrSerDes === Types.json) {
          return typeof value === 'string' ? value : JSON.stringify(value);
        }

        return (typeof typeOrSerDes.serialize === 'function')
          ? typeOrSerDes.serialize(value)
          : value.toString();
      })();

      this.setAttribute(name, attributeValue);
    },
  };
};

const definePropertiesFor = (WebComponent, mapping) => {
  Object.keys(mapping).forEach((name) => {
    const typeOrSerDes = mapping[name];

    Object.defineProperty(
      WebComponent.prototype,
      name,
      mapToPropertyDescriptor(name, typeOrSerDes),
    );
  });
};

const getType = (name) => {
  if (isBoolConvention(name)) {
    return Types.bool;
  }
  if (isHandlerConvention(name)) {
    return Types.event;
  }
  return Types.json;
};

/**
 * Function to register React components as web componenents
 * ReactComponent: A react component
 * tagName: A String name for the new custom tag
 * mappingArg: Either an array of string property names to be connected with
 *   the React components, or an object mapping prop names to types. In the
 *   first case all prop types will default to the JSON type unless the
 *   prop name starts with "on", then it will be an event type.
 */

function register(ReactComponent, tagName, propNames) {
  const createMap = obj => objectFromArray(getType, obj);
  const cleanKeys = obj => mapObjectKeys(sanitizeAttributeName, obj);
  const mapping = pipe(createMap, cleanKeys)(propNames);

  const attributeNames = Object.keys(mapping).map(name => name.toLowerCase());

  // render should be private
  const render = (component) => {
    const props = mapToProps(component, mapping);

    ReactDOM.render(
      React.createElement(ReactComponent, props, React.createElement('slot')),
      component.shadowRoot,
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
};

export {
  register,
};

