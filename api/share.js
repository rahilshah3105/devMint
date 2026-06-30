// Serverless API for sharing notebook rooms on Vercel
// GET /api/share?id={id} - Retrieves room data
// POST /api/share - Saves room data (body: { id: string, data: any })

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const { KV_REST_API_URL, KV_REST_API_TOKEN } = process.env;

  // Initialize a global memory cache as fallback
  // Node globals are kept warm across lambda instances in Vercel as long as the container is reused.
  if (!global.shareRooms) {
    global.shareRooms = new Map();
  }

  // GET Request: Fetch room contents
  if (req.method === 'GET') {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: 'Missing id parameter' });
    }

    if (KV_REST_API_URL && KV_REST_API_TOKEN) {
      try {
        const fetchUrl = `${KV_REST_API_URL}/get/share:${id}`;
        const response = await fetch(fetchUrl, {
          headers: {
            Authorization: `Bearer ${KV_REST_API_TOKEN}`
          }
        });

        if (!response.ok) {
          throw new Error(`KV REST error: ${response.statusText}`);
        }

        const result = await response.json();
        // Upstash / Vercel KV response format: { result: "stringified_value" }
        if (result && result.result) {
          const roomData = JSON.parse(result.result);
          return res.status(200).json(roomData);
        } else {
          return res.status(404).json({ error: 'Room not found' });
        }
      } catch (err) {
        return res.status(500).json({ error: 'Database fetch failed', details: err.message });
      }
    } else {
      // Memory cache fallback
      const room = global.shareRooms.get(id);
      if (room) {
        return res.status(200).json(room);
      } else {
        return res.status(404).json({ error: 'Room not found' });
      }
    }
  }

  // POST Request: Save/Update room contents
  if (req.method === 'POST') {
    try {
      // Support both stringified and parsed bodies
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { id, data } = body;

      if (!id || !data) {
        return res.status(400).json({ error: 'Missing id or data in body' });
      }

      if (KV_REST_API_URL && KV_REST_API_TOKEN) {
        try {
          const fetchUrl = `${KV_REST_API_URL}/set/share:${id}`;
          const setResponse = await fetch(fetchUrl, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${KV_REST_API_TOKEN}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(JSON.stringify(data))
          });

          if (!setResponse.ok) {
            throw new Error(`KV set error: ${setResponse.statusText}`);
          }

          // Set key expiration to 30 days (2592000 seconds) so old shares are cleaned up
          await fetch(`${KV_REST_API_URL}/expire/share:${id}/2592000`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${KV_REST_API_TOKEN}`
            }
          });

          return res.status(200).json({ ok: true, source: 'kv' });
        } catch (kvErr) {
          return res.status(500).json({ error: 'Failed saving to KV', details: kvErr.message });
        }
      } else {
        // Memory cache fallback
        global.shareRooms.set(id, data);
        return res.status(200).json({ ok: true, source: 'memory' });
      }
    } catch (err) {
      return res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
  }

  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
