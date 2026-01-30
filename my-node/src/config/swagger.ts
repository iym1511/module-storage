import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import path from "path";

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "My Express API Docs",
        version: "1.0.0",
        description: "Swagger 문서 예시",
    },
    servers: [
        {
            url: "http://localhost:8000",
        },
    ],
};

const options = {
    swaggerDefinition,
    // 절대 경로 사용 및 controllers 폴더 명시
    apis: [
        path.join(__dirname, "../../src/routes/*.ts"),
        path.join(__dirname, "../../src/controllers/*.ts"),
        path.join(__dirname, "../../dist/routes/*.js"),
        path.join(__dirname, "../../dist/controllers/*.js")
    ], 
};

const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app: Express) {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log("✅ Swagger UI: http://localhost:8000/api-docs");
}