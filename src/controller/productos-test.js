const { Router } = require('express');
const faker = require('faker');

const productosTestRouter = new Router();

productosTestRouter.get('', async (req, res) => {
  const fakeData = [];
  for (let i = 0; i < 5; i += 1) {
    const fakeProduct = {};
    fakeProduct.name = faker.commerce.productName();
    fakeProduct.price = faker.datatype.number();
    fakeProduct.thumbnail = faker.image.imageUrl();
    fakeData.push(fakeProduct);
  }
  res.status(200).send(fakeData);
});

module.exports = { productosTestRouter };
