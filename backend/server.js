const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const cors = require("cors");
const path = require("path");

const app = express();

// CORS PRIMA DI TUTTO
const corsOptions = {
  origin: "*", // Permetti richieste da qualsiasi origine per test, restringi dopo
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Accept"],
  credentials: true,
  maxAge: 86400
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Serve i file statici del frontend
app.use(express.static(path.join(__dirname, "public")));

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

// Route principale ottimizzata
app.post("/create-checkout-session", async (req, res) => {
  try {
    if (!req.body.line_items) {
      return res.status(400).json({ error: 'Invalid request format' });
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: req.body.line_items,
      success_url: "https://kaizenerastripebackend.fly.dev/success.html",
      cancel_url: "https://kaizenerastripebackend.fly.dev/cancel.html",
      billing_address_collection: 'auto',
      shipping_address_collection: { allowed_countries: ['IT'] }
    });
    res.json({ url: session.url });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: 'Errore durante la creazione della sessione di pagamento',
      details: error.message,
      code: error.code
    });
  }
});

// Fallback per SPA: tutte le altre richieste servono index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
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
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Stripe backend + frontend online');
}); 