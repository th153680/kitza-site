(function() {
  var base = window.KITZA_TRACK_URL || '';

  // Page view tracking
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
    xhr.open('POST', base + '/api/track', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
  } catch(e) {}

  // Event tracking (cart, etc.)
  window.kitzaEvent = function(event, payload) {
    try {
      var d = payload || {};
      d.event = event;
      var x = new XMLHttpRequest();
      x.open('POST', base + '/api/event', true);
      x.setRequestHeader('Content-Type', 'application/json');
      x.send(JSON.stringify(d));
    } catch(e) {}
  };
})();
