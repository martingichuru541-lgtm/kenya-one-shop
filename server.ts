import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// Initialize Google GenAI client (User-Agent header required by AI Studio guidelines)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Endpoint: Rafiki AI Shopping Assistant (Sheng + Swahili + English)
app.post('/api/ai/rafiki', async (req, res) => {
  const { message, history } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Check if real API key is configured
  const rawKey = process.env.GEMINI_API_KEY || '';
  const cleanKey = rawKey.replace(/['"]/g, '').trim();
  if (!cleanKey || cleanKey === 'MY_GEMINI_API_KEY' || cleanKey === 'undefined') {
    // Context-aware intelligent fallback in Kenyan Sheng/Swahili
    const lower = message.toLowerCase();
    let reply = `Sasa! Niko hapa kukusaidia kwenye KenyaOne. Uliza kuhusu kahawa safi ya Mt. Kenya, vito vya Maasai, au jinsi ya kulipa na M-Pesa Daraja!`;
    if (lower.includes('coffee') || lower.includes('kahawa') || lower.includes('nyeri')) {
      reply = `Niaje! Kahawa yetu ya Mt. Kenya AA Specialty Coffee kutoka Nyeri inapendwa sana (KES 1,200). Ina notes za blackcurrant na jasmine, na tunatuma county zote 47 via Fargo Courier.`;
    } else if (lower.includes('maasai') || lower.includes('bead') || lower.includes('kikoy') || lower.includes('shanga')) {
      reply = `Karibu sana! Tuna authentic Maasai Ceremonial Beadwork (KES 4,800) iliyosukwa kwa mikono Narok. Kila purchase inalipwa kupitia KenyaOne Escrow mpaka upokee mzigo!`;
    } else if (lower.includes('auction') || lower.includes('bid') || lower.includes('mnada')) {
      reply = `Kwenye KenyaOne Rapid Auctions, unaweka bid kuanzia KES 200+. Pia tuna anti-sniping protection—bid ikitokea sekunde 15 za mwisho, muda unaongezwa sekunde 15!`;
    } else if (lower.includes('zawadi') || lower.includes('gift') || lower.includes('pesa') || lower.includes('cashout')) {
      reply = `Watazamaji wanaweza kutuma Zawadi za live (Chai Moto KES 50 hadi Mt. Kenya Gold KES 5,000) au M-Pesa direct tips! Creator anazicash-out instantly kwenye M-Pesa wallet yake.`;
    }
    return res.json({ reply, source: 'rafiki-kenya-local' });
  }

  try {
    const systemPrompt = `You are "Rafiki AI", KenyaOne's premier native shopping companion and live auction concierge.
You speak authentic Kenyan Sheng, Swahili, and English naturally (code-switching when appropriate, e.g. "Niaje", "Wasee", "Chapaa", "Mambo vipi", "Karibu sana").
Key facts about KenyaOne:
- Kenya's live commerce marketplace empowering farmers, artisans, and creators across all 47 counties.
- Features: Live HD Video Streams, Zawadi Virtual Gifting & Tips (converted to M-Pesa), KenyaOne Rapid Auctions with anti-sniping protection, and Verified Creator Stores.
- Payments: 100% Lipa na M-Pesa (Daraja STK push), Kenyan banks, and cards with Escrow buyer protection.
- Logistics: Fargo Courier, G4S, Sendy, Nairobi express boda, and DHL worldwide export.
- Current top drops: Mount Kenya AA Specialty Coffee (KES 1,200), Maasai Ceremonial Collar (KES 4,800), Kisii Soapstone "Undugu" Family Sculpture (KES 3,800), and Kitenge Reversible Bomber Jacket (KES 6,500).

Respond helpfully, concisely (2-4 sentences max), in a friendly Kenyan tone with relevant product or delivery advice.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: message,
      config: {
        systemInstruction: systemPrompt,
      },
    });

    const reply = response.text || 'Karibu KenyaOne! Nieleze unachotafuta leo.';
    return res.json({ reply, source: 'gemini-3.8-flash' });
  } catch (error: any) {
    console.error('Rafiki AI generation error:', error?.message || error);
    const lower = message.toLowerCase();
    let reply = `Sasa! Rafiki yuko hapa kukusaidia kwenye KenyaOne. Uliza kuhusu kahawa safi ya Mt. Kenya, vito vya Maasai, au jinsi ya kulipa na M-Pesa Daraja!`;
    if (lower.includes('coffee') || lower.includes('kahawa') || lower.includes('nyeri')) {
      reply = `Niaje! Kahawa yetu ya Mt. Kenya AA Specialty Coffee kutoka Nyeri inapendwa sana (KES 1,200). Ina notes za blackcurrant na jasmine, na tunatuma county zote 47 via Fargo Courier.`;
    } else if (lower.includes('maasai') || lower.includes('bead') || lower.includes('kikoy') || lower.includes('shanga')) {
      reply = `Karibu sana! Tuna authentic Maasai Ceremonial Beadwork (KES 4,800) iliyosukwa kwa mikono Narok. Kila purchase inalipwa kupitia KenyaOne Escrow mpaka upokee mzigo!`;
    } else if (lower.includes('auction') || lower.includes('bid') || lower.includes('mnada')) {
      reply = `Kwenye KenyaOne Rapid Auctions, unaweka bid kuanzia KES 200+. Pia tuna anti-sniping protection—bid ikitokea sekunde 15 za mwisho, muda unaongezwa sekunde 15!`;
    } else if (lower.includes('zawadi') || lower.includes('gift') || lower.includes('pesa') || lower.includes('cashout')) {
      reply = `Watazamaji wanaweza kutuma Zawadi za live (Chai Moto KES 50 hadi Mt. Kenya Gold KES 5,000) au M-Pesa direct tips! Creator anazicash-out instantly kwenye M-Pesa wallet yake.`;
    }
    return res.json({ reply, source: 'fallback' });
  }
});

// Endpoint: AI Live Chat Moderation
app.post('/api/ai/moderate', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.json({ isSafe: true });

  const scamTriggers = ['send money to personal', 'whatsapp private', 'fake mpesa', 'send pin'];
  const hasTrigger = scamTriggers.some(t => text.toLowerCase().includes(t));

  return res.json({
    isSafe: !hasTrigger,
    flagged: hasTrigger,
    reason: hasTrigger ? 'Potential off-platform payment violation' : null
  });
});

// Endpoint: AI Live Shopping Pitch Script Generator
app.post('/api/ai/pitch-script', async (req, res) => {
  const { title, category, priceKes, countyOrigin } = req.body;

  const rawKey = process.env.GEMINI_API_KEY || '';
  const cleanKey = rawKey.replace(/['"]/g, '').trim();

  if (!cleanKey || cleanKey === 'MY_GEMINI_API_KEY' || cleanKey === 'undefined') {
    return res.json({
      script: `🔥 "Wadau karibuni sana! Look at this gorgeous ${title || 'item'} straight from ${countyOrigin || 'Kenya'}! Authentic craftsmanship, premium materials, and available right now for only KES ${priceKes ? priceKes.toLocaleString() : '1,500'}. Tap the pinned drop below now — Lipa na M-Pesa is instant and escrow protected across all 47 counties!"`
    });
  }

  try {
    const prompt = `Write an energetic, high-converting 30-45 second live broadcast sales pitch script for a Kenyan live commerce stream.
Product: ${title} (${category})
Price: KES ${priceKes}
Origin County: ${countyOrigin}
Include a mix of Kenyan Sheng, Swahili, and English ("Karibuni wadau", "Mzigo safi", "Lipa na M-Pesa", "Grab this drop").
Keep it under 90 words, punchy, conversational, ready for the host to read on live video.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    return res.json({
      script: response.text || `🔥 "Wadau karibuni sana! Check out this authentic ${title} from ${countyOrigin}! Only KES ${priceKes ? priceKes.toLocaleString() : 'special price'}. Tap pinned drop to checkout!"`
    });
  } catch (err: any) {
    return res.json({
      script: `🔥 "Wadau karibuni sana! Look at this gorgeous ${title || 'item'} straight from ${countyOrigin || 'Kenya'}! Tap the pinned drop below now for Lipa na M-Pesa instant checkout!"`
    });
  }
});

// Vite Middleware for development
async function startServer() {
  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: 3000 },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static files
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`KenyaOne Server running on port ${PORT}`);
  });
}

startServer();
