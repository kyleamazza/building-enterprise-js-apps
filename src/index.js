import http from 'http';

function requestHandler(req, res) {
  if (req.method === 'POST' && req.url === '/users') {
    res.writeHead(400, {
      'Content-Type': 'application/json'
    });
    res.end(JSON.stringify({'message': 'Payload should not be empty'}));
    return;
  }

  res.writeHead(200, {
    'Content-Type': 'text/plain'
  });
  res.end('Hello world');
}

const server = http.createServer(requestHandler);

server.listen(process.env.SERVER_PORT, () => {
  console.log(`Server listening on port ${process.env.SERVER_PORT}`);
});
