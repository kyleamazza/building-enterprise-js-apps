import http from 'http';

function requestHandler(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello world');
}

const server = http.createServer(requestHandler);

server.listen(3000, () => {
  console.log('Server listening on 3000...');
});
