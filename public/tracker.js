(function() {
  var endpoint = (window.KITZA_TRACK_URL || '') + '/api/track';
  try {
    var data = {
      page:     location.pathname + location.search,
      referrer: document.referrer || '',
      sw:       screen.width,
      sh:       screen.height,
      lang:     navigator.language || '',
      plat:     navigator.platform || ''
    };
    var xhr = new XMLHttpRequest();
    xhr.open('POST', endpoint, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
  } catch(e) {}
})();
