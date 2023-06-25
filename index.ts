import { createServer } from 'http';
import WebSocket, { createWebSocketStream } from 'ws';
import fs from 'fs';
const server = createServer((request, response) => {
  const url = new URL(request.url as string, 'http://127.0.0.1');
  if (url.pathname === '/') {
    const stream = fs.createReadStream('./index.html');
    stream.pipe(response);
  } else if (url.pathname === '/sse') {
    response.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    });
    // 创建文件读取流
    const readStream = fs.createReadStream('test.txt', {
      encoding: 'utf-8',
      highWaterMark: 1 // 每次读取一个字母
    });
    // 监听数据事件
    readStream.on('data', (chunk) => {
      // 将每个字母作为一个事件发送到客户端
      console.log('读取');
      response.write(`event:exampleSSE\ndata: ${chunk}\n\n`);
      if (!chunk) {
        response.end();
      }
    });
  } else {
    response.end('');
  }
});

server.listen('3000', () => {
  console.log('http://127.0.0.1:3000');
});

const ws = new WebSocket.Server({ port: 3001 });

ws.on('connection', function (socket) {
  console.log('A client connected.');

  socket.on('message', function (message) {
    if (message.toString() === '打字机') {
      const readStream = fs.createReadStream('./test.txt', 'utf-8');
      readStream.on('data', (data) => {
        socket.send(data);
      });
      readStream.on('close', () => {
        socket.close();
      });
    }
  });

  socket.on('close', function () {
    console.log('Client disconnected.');
  });
});
