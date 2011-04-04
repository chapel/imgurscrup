http = require 'http'
querystring = require 'querystring'  
    
server = http.createServer (sReq, sRes) ->
  urlQuery = sReq.url.replace /[^a-zA-Z 0-9=]+/g, ''
  query = querystring.parse urlQuery
  unless query.key
    sRes.writeHead 500,
      "Content-Type": "text/plain"
    sRes.end 'URL should end with key=<key> where <key> is your Imgur.com Anonymous API key.'
  else
    cReq = http.request
      host:'api.imgur.com'
      port: 80
      path: "/2/upload.json?key=#{query.key}"
      method: 'POST'
      headers:
        'Content-Type': 'image/png'
        'Transfer-Encoding': 'chunked'

    sReq.on 'data', (chunk) ->
      cReq.write chunk

    sReq.on 'end', ->
      cReq.end()
      cReq.on 'response', (cRes) ->
        result = ''
        cRes.on 'data', (chunk) ->
          result += chunk
        cRes.on 'end', ->
          temp = JSON.parse result
          url = if temp.error then temp.error.message else temp.upload.links.original
          sRes.writeHead 201,
            "Content-Type": "text/plain"
            'Content-Length': url.length
          sRes.end url


# Change this number to change what port is used. e.g. http://127.0.0.1:8000/key=<key>
server.listen process.argv[2] or 8000