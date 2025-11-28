import express from 'express';
import cors from 'cors';
import { analyzePage } from '../src/analyzePage.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for demo
app.use(cors());

// Serve static files from demo directory
app.use(express.static('demo'));

// API endpoint
app.get('/api/analyze', async (req, res) => {
  try {
    const url = req.query.url;
    const dynamic = req.query.dynamic === 'true';
    
    if (!url) {
      return res.status(400).json({
        error: 'Missing url parameter'
      });
    }

    const result = await analyzePage(url, { dynamic });
    res.json(result);
  } catch (error) {
    console.error('Error analyzing page:', error);
    res.status(500).json({
      error: 'Failed to analyze page',
      message: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Demo server running at http://localhost:${PORT}`);
  console.log(`API endpoint: http://localhost:${PORT}/api/analyze?url=<your-url>`);
});

