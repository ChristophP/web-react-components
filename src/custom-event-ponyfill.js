// code taken and adapted to a ponyfill from:
// https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent

export default (() => {
  if (typeof window.CustomEvent === 'function') return window.CustomEvent;

  function CustomEvent(event, {
    bubbles = false,
    cancelable = false,
    detail = undefined,
  } = {}) {
    const evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, bubbles, cancelable, detail);
    return evt;
  }

  CustomEvent.prototype = window.Event.prototype;

  return CustomEvent;
})();

