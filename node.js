// node.js
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
app.use(cors());
app.use(express.json());

// Swagger config
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Telecom API",
      version: "1.0.0",
      description: "User Registration + Airtime Balance API"
    }
  },
  apis: ["./routes/*.js"]
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/users', require('./routes/users'));

app.listen(3000, () => console.log("🚀 Server running at http://localhost:3000\nSwagger: http://localhost:3000/api-docs"));
