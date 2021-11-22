const http = require('http')
const fs = require('fs')
const path = require('path')
const { connections } = require('mongoose')


let server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url)
  const ext = path.extname(filePath)
  let contentType = 'text/html'
  
  switch (ext) { 
    case '.css':
      contentType = 'text/css'
      break
    case '.js':
      contentType = 'text/javascript'
      break
    default:
      contentType = 'text/html'
      break
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      fs.readFile(path.join(__dirname, 'public', 'error.html'), (err, data) => {
        if (err) {
          res.writeHead(500)
          res.end('Error')
        } else {
          res.writeHead(200, {
            'Content-Type': 'text/html'
          })
          res.end(data)
        }
      })
    } else {
      res.writeHead(200, {
        'Content-Type': contentType
      })
      res.end(content)
    }
  })
})

let io = require('socket.io')(server)

server.listen(3000, () => {
  console.log('Server has been started...');
})

let users = [];
let connected = [];

io.sockets.on('connection', (socket) => {
  console.log('Connected... ');
  connected.push(socket)

  socket.on('disconnect', (data) => {
    connected.splice(connected.indexOf(socket), 1)
    console.log('Disconnected...');
  })
})