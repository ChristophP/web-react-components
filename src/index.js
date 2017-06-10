import React from 'react';
import ReactDOM from 'react-dom';

const Empty = () => null;

// TODO make this work in React
// This convert a DOM node into a react component
const toVdom = (element, nodeName) => {
  if (element.nodeType === 3) return element.nodeValue;
  if (element.nodeType !== 1) return null;

  const { attributes, childNodes } = element;
  const props = Array.from(attributes).reduce(
    (obj, { name, value }) => ({ ...obj, [name]: value }), {});
  const children = Array.from(childNodes).map(toVdom);

  return React.createElement(nodeName
    || element.nodeName.toLowerCase(), props, children);
};

export default function register(Component, tagName) {
  class WebReactComponent extends HTMLElement {
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
      ReactDOM.render(
        toVdom(this, Component),
        this,
      );
    }

    // TODO use unmount component at node
    unRenderElement() {
      render(React.createElement(Empty), this.shadowRoot, this._root);
    }
  }

	return document.registerElement(
		tagName || Component.displayName || Component.name,
		WebReactComponent
	);
}
