const express = require('express');
const config = require('config');
const handlebars = require('express-handlebars');
const { Server } = require('socket.io');
const { createServer } = require('http');
const emoji = require('node-emoji');
const db = require('./models/db');
const { normalizado } = require('./controller/normalizacion');

const app = express();
const server = createServer(app);
const io = new Server(server);
const { productosRouter } = require('./controller/productos');
const { productosTestRouter } = require('./controller/productos-test');
const { messagesRouter } = require('./controller/mensajes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = config.app.port || 8080;
app.engine(
  'hbs',
  handlebars({
    extname: 'hbs',
    defaultLayout: 'index.hbs',
    layoutsDir: `${__dirname}/views/layouts`,
    partialsDir: `${__dirname}/views/partials`,
  }),
);

app.set('views', './src/views');
app.set('view engine', 'hbs');
app.get('/', (req, res) => {
  res.render('main', {});
});
app.use('/products', productosRouter);
app.use('/products-test', productosTestRouter);
app.use('/messages', messagesRouter);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log(emoji.get('fire'), 'New websocket connection');
  socket.emit('welcomeMessage', {});
  socket.on('clientAdd', () => {
    io.sockets.emit('serverAdd', {});
  });
  socket.on('message', () => {
    io.sockets.emit('newMessage', {});
  });
  socket.on('disconnect', () => {
    console.log(emoji.get('wave'), 'Client disconected');
  });
});

server.listen(PORT, () => {
  console.log(`Server up and listening on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  console.log(err);
});
