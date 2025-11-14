import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

// Redis 클라이언트 생성
const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
    db: Number(process.env.REDIS_DB) || 0,
    tls: process.env.REDIS_TLS === "true" ? {} : undefined, // Redis Cloud는 TLS 필수
    retryStrategy: (times) => Math.min(times * 50, 2000),
});

// 연결 성공 이벤트
redis.on("connect", () => {
    console.log("✅ Redis 연결 성공");
});

// 연결 실패 이벤트
redis.on("error", (err) => {
    console.error("❌ Redis 연결 오류:", err);
});

export default redis;