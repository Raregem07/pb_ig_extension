document.dispatchEvent(new CustomEvent('getWindowObject', {
  'detail': {
    'initialData': window._sharedData
  }
}));
