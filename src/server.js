const express = require('express');
const config = require('config');
const handlebars = require('express-handlebars');
const { Server } = require('socket.io');
const { createServer } = require('http');
const emoji = require('node-emoji');

const app = express();
const server = createServer(app);
const io = new Server(server);
const { productos, productosRouter } = require('./productos');

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
app.use('/productos', productosRouter);
app.use(express.static('public'));
const bienvenida = {
  saludo: 'hola cliente',
  productos,
}
io.on('connection', (socket) => {
  console.log(emoji.get('fire'), 'New websocket connection');
  socket.emit('welcomeMessage', bienvenida);
  socket.on('clientAdd', (product) => {
    productos.push(JSON.parse(product));
    io.sockets.emit('serverAdd', JSON.parse(product));
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
