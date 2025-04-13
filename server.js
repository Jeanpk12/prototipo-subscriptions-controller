const express = require('express');
const cors = require('cors');
const path = require('path');
const subscriptionsRouter = require('./routes/subscriptions');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Serve arquivos estáticos da pasta "static"
app.use(express.static(path.join(__dirname, 'static')));

// API Routes
app.use('/api/subscriptions', subscriptionsRouter);

// Rota raiz serve o index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'static/index.html'));
});

// Inicializa o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
