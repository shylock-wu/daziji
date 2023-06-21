import { createServer } from 'http';
import WebSocket, { createWebSocketStream } from 'ws';
import fs from 'fs';
const server = createServer((request, response) => {
  const url = new URL(request.url as string, 'http://127.0.0.1');
  if (url.pathname === '/') {
    const stream = fs.createReadStream('./index.html');
    stream.pipe(response);
  } else if (url.pathname === '/sse') {
  } else {
    response.end('');
  }
});

server.listen('3000', () => {
  console.log('http://127.0.0.1:3000');
});

const wss = new WebSocket.Server({ port: 3001 });

wss.on('connection', function connection(ws) {
  console.log('A client connected.');

  ws.on('message', function incoming(message) {
    console.log(`Received message: ${message}`);
    // 在这里可以对客户端发送的消息进行处理
  });

  ws.on('close', function onClose() {
    console.log('Client disconnected.');
  });
});
