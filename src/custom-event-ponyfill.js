// code taken and adapted to a ponyfill from:
// https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent

export default (() => {
  if (typeof window.CustomEvent === "function" ) return window.CustomEvent;

  function CustomEvent (event, params) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  }

  CustomEvent.prototype = window.Event.prototype;

  return CustomEvent;
})();

