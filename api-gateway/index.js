const express = require("express");
const httpProxy = require("http-proxy");
// require("dotenv").config();
const cors = require('cors');
const app = express();
app.use(cors({
    origin: '*',
    credentials: false,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'traceparent', 'tracestate', 'baggage']
}));
const proxy = httpProxy.createProxyServer({});


app.use("/users", (req, res) => {
  console.log(req.headers);
  proxy.web(req, res, { target: `${process.env.USERS_ENDPOINT}/users`, changeOrigin: true });
});


app.use("/cart", (req, res) => {
  console.log(req.headers);
  proxy.web(req, res, { target: `${process.env.CART_ENDPOINT}/cart`, changeOrigin: true });
});

app.use("/products", (req, res) => {
  console.log(req.headers);
  proxy.web(req, res, { target: `${process.env.PRODUCTS_ENDPOINT}/products`, changeOrigin: true });
});
app.use("/Images", (req, res) => {
  console.log(req.headers);
  proxy.web(req, res, { target: `${process.env.PRODUCTS_ENDPOINT}/Images`, changeOrigin: true });
});

app.use("/orders", (req, res) => {
  console.log(req.headers);
  proxy.web(req, res, { target: `${process.env.ORDERS_ENDPOINT}/orders`, changeOrigin: true });
});

proxy.on("error", (err, req, res) => {
  console.error(err);
  res.status(500).send("Service unavailable");
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`API Gateway listening on ${port}`);
});