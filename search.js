(function() {
  function getQuery() {
    var params = new URLSearchParams(window.location.search);
    return params.get("q") || "";
  }

  window.feedLoaded = function(data) {
    var entries = data.feed.entry || [];
    var query = getQuery().toLowerCase();
    var results = [];
    for (var i = 0; i < entries.length; i++) {
      var entry = entries[i];
      var title   = entry.title.$t.toLowerCase();
      var content = entry.content ? entry.content.$t.toLowerCase() : "";
      var summary = entry.summary ? entry.summary.$t.toLowerCase() : "";

      if (title.indexOf(query) > -1 || content.indexOf(query) > -1 || summary.indexOf(query) > -1) {
        results.push(entry);
      }
    }
    renderResults(results, query);
  };

  function renderResults(results, query) {
    var container = document.getElementById("search-results");
    if (!container) return;

    if (!results.length) {
      container.innerHTML = "<p>No results found for <strong>" + query + "</strong>.</p>";
      return;
    }

    var html = "<ul>";
    for (var i = 0; i < results.length; i++) {
      var entry = results[i];
      var link = "";
      for (var j = 0; j < entry.link.length; j++) {
        if (entry.link[j].rel === "alternate") {
          link = entry.link[j].href;
          break;
        }
      }
      var title = entry.title.$t;
      var snippet = entry.summary ? entry.summary.$t : "";
      html += '<li><a href="' + link + '">' + title + "</a><p>" + snippet + "</p></li>";
    }
    html += "</ul>";
    container.innerHTML = html;
  }

  // auto-load feed
  if (window.location.pathname.indexOf("/search") === 0) {
    var s = document.createElement("script");
    s.src = "/feeds/posts/default?alt=json-in-script&callback=feedLoaded&max-results=50";
    document.body.appendChild(s);
  }
})();
