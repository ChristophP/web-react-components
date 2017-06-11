import React from 'react';
import ReactDOM from 'react-dom';

const Empty = () => null;

// This converts a DOM node into a react component
const toVdom = (element, nodeName) => {
  const { attributes, childNodes, nodeType, nodeValue } = element;
  if (nodeType === 3) return nodeValue;
  if (nodeType !== 1) return null;

  const elementType = nodeName || element.nodeName.toLowerCase();
  const props = Array.from(attributes).reduce(
    (obj, { name, value }) => ({ ...obj, [name]: value }), {});
  const children = Array.from(childNodes).map(toVdom);

  return React.createElement(elementType, props, children);
};

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

	return document.registerElement(
		tagName || Component.displayName || Component.name,
		WebReactComponent
	);
}
