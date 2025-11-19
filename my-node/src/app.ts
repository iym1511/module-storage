import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import {setupSwagger} from "./config/swagger";
import cors from "cors";

// ✅ CORS 설정은 라우터보다 위에

const app = express();
app.use(cors({
    origin: [
        "http://localhost:3000",              // 로컬 개발
        "https://module-storage-original.vercel.app",  // Vercel 프로덕션
        "https://module-storage-original-dkjk7lebb-iym1511s-projects.vercel.app",
        "http://13.54.93.233:8000",
        // Vercel 모든 배포 URL 허용하려면:
        /^https:\/\/.*\.vercel\.app$/,
    ],
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser()); // ✅ 요청 헤더의 쿠키를 객체로 파싱

app.use("/", authRoutes);

// Swagger 연결
setupSwagger(app);

export default app;