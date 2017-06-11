import React from 'react';
import ReactDOM from 'react-dom';

// This converts a DOM node into a react component
const toVdom = (element, nodeName) => {
  const { attributes, childNodes, nodeType, nodeValue } = element;
  if (nodeType === 3) return nodeValue;
  if (nodeType !== 1) return null;

  const elementType = nodeName || element.nodeName.toLowerCase();
  const props = Array.from(attributes)
    // exclude data-reactid
    .filter(({ name }) => name !== 'data-reactid')
    .reduce(
    (obj, { name, value }) => ({ ...obj, [name]: parseAttribute(value) }), {});
  const children = Array.from(childNodes).map(child => toVdom(child));

  return React.createElement(elementType, props, children);
};

// this function takes care of JSON parsing values if wrapped by curly braces
const parseAttribute = value => (
  (value.startsWith('{') && value.endsWith('}')) ?
    JSON.parse(value.slice(1, -1)) : value
);

export default function register(Component, tagName, baseClass = HTMLElement) {
  class WebReactComponent extends baseClass {
    attachedCallback() {
      this.renderElement();
    }

    attributeChangedCallback() {
      this.renderElement();
    }

    detachedCallback() {
      this.unRenderElement();
    }

    renderElement() {
      ReactDOM.render(toVdom(this, Component), this);
    }

    unRenderElement() {
      ReactDOM.unmountComponentAtNode(this);
    }
  }

	return document.registerElement(tagName, WebReactComponent);
}
