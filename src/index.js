import React from 'react';
import ReactDOM from 'react-dom';

const Empty = () => null;

// TODO make this work in React
const toVdom = (element, nodeName) => {
  if (element.nodeType===3) return element.nodeValue;
  if (element.nodeType!==1) return null;
  let children=[], props={}, i=0, a=element.attributes, cn=element.childNodes;
  for (i=a.length; i--; ) props[a[i].name] = a[i].value;
  for (i=cn.length; i--; ) children[i] = toVdom(cn[i]);
  return h(nodeName || element.nodeName.toLowerCase(), props, children);
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

    // TODO remove shadow DOM
    renderElement() {
      this._root = ReactDOM.render(
        toVdom(this, Component),
        this.shadowRoot || this.createShadowRoot(),
        this._root
      );
    }

    unRenderElement() {
      render(h(Empty), this.shadowRoot, this._root);
    }
  }

	return document.registerElement(
		tagName || Component.displayName || Component.name,
		WebReactComponent
	);
}
