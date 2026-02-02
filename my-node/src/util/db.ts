import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "8361",
  database: process.env.DB_NAME || "fullstackDB",
});

export default pool;

/*

  ⚡ 최종 요약

  DB: 5432번 포트를 여는 사람 (Open/Bind/Listen)
  Node.js: 5432번 포트로 들어가는 사람 (Connect)
  Docker: 5435번을 5432번으로 이어주는 사람 (Port Forwarding)

  */
