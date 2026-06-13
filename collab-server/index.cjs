// Simple in-memory WebSocket collaboration server
// Run with: node collab-server/index.cjs
const http = require('http');
const WebSocket = require('ws');
const PORT = process.env.PORT || 6789;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Collab WS server running');
});

const wss = new WebSocket.Server({ server });

// rooms: { roomId: { code: '', clients: Set(ws) } }
const rooms = new Map();

function safeSend(ws, obj) {
  try { ws.send(JSON.stringify(obj)); } catch (e) {}
}

wss.on('connection', (ws) => {
  ws.roomId = null;

  ws.on('message', (msg) => {
    let data;
    try { data = JSON.parse(msg); } catch (e) { return; }

    if (data.type === 'join' && data.roomId) {
      const roomId = data.roomId;
      ws.roomId = roomId;
      if (!rooms.has(roomId)) rooms.set(roomId, { code: '', clients: new Set() });
      const room = rooms.get(roomId);
      room.clients.add(ws);
      // send current code to new client
      safeSend(ws, { type: 'init', code: room.code });
    }

    if (data.type === 'update' && ws.roomId) {
      const room = rooms.get(ws.roomId);
      if (!room) return;
      room.code = data.code || '';
      // broadcast to others
      for (const client of room.clients) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          safeSend(client, { type: 'update', code: room.code });
        }
      }
    }
  });

  ws.on('close', () => {
    if (ws.roomId) {
      const room = rooms.get(ws.roomId);
      if (room) {
        room.clients.delete(ws);
        if (room.clients.size === 0) rooms.delete(ws.roomId);
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Collab WebSocket server listening on ws://localhost:${PORT}`);
});
