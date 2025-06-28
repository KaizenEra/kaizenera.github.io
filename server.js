const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const cors = require("cors");

const app = express();

// CORS PRIMA DI TUTTO (temporaneamente aperto per debug)
app.use(cors());
app.options('*', cors());

// Compressione delle risposte
app.use(express.json({ limit: '1mb' }));

// Cache headers per le risposte
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

// Logging ottimizzato
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Endpoint di test
app.get("/", (req, res) => {
  res.json({ 
    message: "Backend Fly.io is running!", 
    timestamp: new Date().toISOString(),
    stripe: process.env.STRIPE_SECRET_KEY ? "Configured" : "Not configured"
  });
});

// Endpoint di test per CORS
app.get("/test-cors", (req, res) => {
  res.json({ 
    message: "CORS test successful",
    origin: req.headers.origin,
    method: req.method
  });
});

// Route principale ottimizzata
app.post("/create-checkout-session", async (req, res) => {
  try {
    console.log("Received checkout request:", req.body);
    
    if (!req.body.item || !req.body.item.price_data) {
      console.log("Invalid request format");
      return res.status(400).json({ error: 'Invalid request format' });
    }
    
    if (!process.env.STRIPE_SECRET_KEY) {
      console.log("Stripe secret key not configured");
      return res.status(500).json({ error: 'Stripe not configured' });
    }
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [req.body.item],
      success_url: "https://kaizenera.github.io/success.html",
      cancel_url: "https://kaizenera.github.io/cancel.html",
      expires_at: Math.floor(Date.now() / 1000) + 1800, // 30 minuti
      billing_address_collection: 'auto',
      shipping_address_collection: {
        allowed_countries: ['IT'],
      },
    }, {
      timeout: 5000 // Timeout di 5 secondi per la creazione della sessione
    });
    
    console.log("Stripe session created:", session.id);
    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(error.statusCode || 500).json({
      error: 'Errore durante la creazione della sessione di pagamento',
      details: error.message,
      code: error.code
    });
  }
});

// Gestione errori ottimizzata
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(err.status || 500).json({
    error: 'Errore interno del server',
    details: err.message,
    code: err.code
  });
});

// Configurazione del server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Stripe backend online');
  console.log('Stripe key configured:', process.env.STRIPE_SECRET_KEY ? 'YES' : 'NO');
}); 