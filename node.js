// node.js
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = express();
app.use(cors());
app.use(express.json());

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Telecom API",
      version: "1.0.0",
      description:
        "Telecom system: user registration, airtime, bundles, purchase, balance",
    },
  },
  apis: ["./routes/*.js"],
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/users", require("./routes/users"));
app.use("/bundles", require("./routes/bundles"));

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
  console.log("📄 Swagger UI: http://localhost:3000/api-docs");
});
