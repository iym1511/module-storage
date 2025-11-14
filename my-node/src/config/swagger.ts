import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "My Express API Docs",
        version: "1.0.0",
        description: "Swagger 문서 예시",
    },
    servers: [
        {
            url: "http://localhost:8000", // 포트 맞춰줘
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: ["./src/**/*.ts"], // 이 경로 꼭 맞춰야 swagger-jsdoc이 인식함
};

const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app: Express) {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log("✅ Swagger UI: http://localhost:8000/api-docs");
}