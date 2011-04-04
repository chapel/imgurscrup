#!/usr/bin/env node

(function() {
  var http, querystring, server;
  http = require('http');
  querystring = require('querystring');
  server = http.createServer(function(sReq, sRes) {
    var cReq, query, urlQuery;
    urlQuery = sReq.url.replace(/[^a-zA-Z 0-9=]+/g, '');
    query = querystring.parse(urlQuery);
    if (!query.key) {
      sRes.writeHead(500, {
        "Content-Type": "text/plain"
      });
      return sRes.end('URL should end with key=<key> where <key> is your Imgur.com Anonymous API key.');
    } else {
      cReq = http.request({
        host: 'api.imgur.com',
        port: 80,
        path: "/2/upload.json?key=" + query.key,
        method: 'POST',
        headers: {
          'Content-Type': 'image/png',
          'Transfer-Encoding': 'chunked'
        }
      });
      sReq.on('data', function(chunk) {
        return cReq.write(chunk);
      });
      return sReq.on('end', function() {
        cReq.end();
        return cReq.on('response', function(cRes) {
          var result;
          result = '';
          cRes.on('data', function(chunk) {
            return result += chunk;
          });
          return cRes.on('end', function() {
            var temp, url;
            temp = JSON.parse(result);
            url = temp.error ? temp.error.message : temp.upload.links.original;
            sRes.writeHead(201, {
              "Content-Type": "text/plain",
              'Content-Length': url.length
            });
            return sRes.end(url);
          });
        });
      });
    }
  });
  server.listen(process.argv[2] || 8000);
}).call(this);
