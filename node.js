const express = require('express');
const app = express();
const userRoutes = require('./routes/users');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

app.use(express.json());
app.use('/users', userRoutes);

// Swagger setup
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Users API",
      version: "1.0.0",
      description: "API to manage users",
    },
    servers: [
      { url: "http://localhost:3000" },
    ],
  },
  apis: ["./routes/users.js"],
};
const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.get('/', (req, res) => res.send('API running'));

app.listen(3000, () => console.log('Server running on port 3000'));
