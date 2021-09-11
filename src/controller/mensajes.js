const { Router } = require('express');
const Message = require('../models/mensajes');

const messages = new Message();

const messagesRouter = new Router();

messagesRouter.get('', async (req, res) => {
  const productos = await messages.getAll();
  res.status(200).send(productos);
});

messagesRouter.post('', async (req, res) => {
  const { user, text, time } = req.body;
  const message = { user, text, time };
  await messages.createMessage(message);
  res.status(200).send({ message: 'success' });
});

module.exports = { messagesRouter };
