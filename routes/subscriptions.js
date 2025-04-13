const express = require('express');
const router = express.Router();
const { readData, writeData } = require('../utils/fileHandler');

// Middleware de validação
const validateSubscription = (req, res, next) => {
  const { name, value, billing_date, type } = req.body;
  
  if (!name || !value || !billing_date || !type) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  if (typeof value !== 'number' || value <= 0) {
    return res.status(400).json({ error: 'Valor deve ser um número positivo' });
  }

  if (!['streaming', 'musica', 'jogos', 'produtividade', 'armazenamento', 'educacao', 'saude', 'alimentacao', 'transporte', 'servicos_essenciais', 'outros'].includes(type)) {
    return res.status(400).json({ error: 'Tipo de assinatura inválido' });
  }

  next();
};

// Middleware de tratamento de erros
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
};

// Helper para encontrar assinatura
const findSubscription = (id) => {
  const data = readData();
  const subscription = data.find(item => item.id === id);
  return { data, subscription, index: data.findIndex(item => item.id === id) };
};

// GET /api/subscriptions
router.get('/', (req, res) => {
  try {
    const data = readData();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// POST /api/subscriptions
router.post('/', validateSubscription, (req, res, next) => {
  try {
    const data = readData();
    const newItem = { 
      id: Date.now(), 
      ...req.body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    data.push(newItem);
    writeData(data);
    res.status(201).json(newItem);
  } catch (error) {
    next(error);
  }
});

// PUT /api/subscriptions/:id
router.put('/:id', validateSubscription, (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { data, subscription, index } = findSubscription(id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Assinatura não encontrada' });
    }

    data[index] = { 
      ...subscription, 
      ...req.body,
      updated_at: new Date().toISOString()
    };
    writeData(data);
    res.json(data[index]);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/subscriptions/:id
router.delete('/:id', (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { data, subscription, index } = findSubscription(id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Assinatura não encontrada' });
    }

    const filtered = data.filter(item => item.id !== id);
    writeData(filtered);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// Aplicar middleware de tratamento de erros
router.use(errorHandler);

module.exports = router;

