var http = require('http'),
    querystring = require('querystring'),
    client = http.createClient(80, 'api.imgur.com')
    
    
var server = http.createServer(function(req, res) {
  var url = req.url.replace('/', '')
  var query = querystring.parse(url)
  var request = client.request('POST', '/2/upload.json?key='+query.key, {
    'Host':'api.imgur.com',
    'Content-Type': 'image/png',
    'Transfer-Encoding': 'chunked'
  })
  
  req.on('data', function(chunk) {
    request.write(chunk)
  })

  req.on('end', function() {
    request.end()
    request.on('response', function(response) {
      var result = ''
      response.on('data', function(chunk) {
        result += chunk
      })
      response.on('end', function() {
        var temp = JSON.parse(result), url = ''
        if (temp.error) url = temp.error.message
        else url = temp.upload.links.original
        res.writeHead(201, {"Content-Type": "text/plain", 'Content-Length': url.length})
        res.end(url)
      })
    })
  })
})

server.listen(8000)