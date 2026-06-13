import { useEffect, useRef, useState, useCallback } from 'react';

const WS_URL = (process.env.NODE_ENV === 'development') ? 'ws://localhost:6789' : (window.location.origin.replace(/^http/, 'ws'));

export default function useCollab(initialCode = '') {
  const wsRef = useRef(null);
  const [roomId, setRoomId] = useState(null);
  const [remoteCode, setRemoteCode] = useState(null);

  const connect = useCallback((rid) => {
    if (!rid) return;
    setRoomId(rid);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'join', roomId: rid }));
      return;
    }

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.addEventListener('open', () => {
      ws.send(JSON.stringify({ type: 'join', roomId: rid }));
    });

    ws.addEventListener('message', (ev) => {
      try {
        const data = JSON.parse(ev.data);
        if (data.type === 'init') setRemoteCode(data.code || '');
        if (data.type === 'update') setRemoteCode(data.code || '');
      } catch (e) {}
    });

    ws.addEventListener('close', () => {
      wsRef.current = null;
    });
  }, []);

  const generateId = () => Math.random().toString(36).slice(2, 10);

  const createRoom = useCallback(() => {
    const id = generateId();
    connect(id);
    return id;
  }, [connect]);

  const sendUpdate = useCallback((code) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && roomId) {
      wsRef.current.send(JSON.stringify({ type: 'update', code, roomId }));
    }
  }, [roomId]);

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        try { wsRef.current.close(); } catch (e) {}
      }
    };
  }, []);

  return { roomId, remoteCode, createRoom, connect, sendUpdate };
}
