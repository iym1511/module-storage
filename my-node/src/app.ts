import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import {setupSwagger} from "./config/swagger";
import cors from "cors";

// ✅ CORS 설정은 라우터보다 위에

const app = express();
app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser()); // ✅ 요청 헤더의 쿠키를 객체로 파싱

app.use("/", authRoutes);

// Swagger 연결
setupSwagger(app);

export default app;