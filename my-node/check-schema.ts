import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Docker Compose 환경변수 기반 또는 로컬 테스트용 기본값
const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5435, // docker-compose 외부 포트는 5435
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '8361',
  database: process.env.DB_NAME || 'fullstackDB',
});

async function getTableSchema() {
  try {
    await client.connect();
    console.log('✅ Connected to database');

    // 1. 테이블 목록 조회
    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    const tables = tablesRes.rows.map(row => row.table_name);
    console.log('\n📊 Tables found:', tables);

    // 2. 각 테이블의 컬럼 정보 조회
    for (const table of tables) {
      console.log(`\n📋 Schema for table: [${table}]`);
      const columnsRes = await client.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = $1
        ORDER BY ordinal_position;
      `, [table]);

      console.table(columnsRes.rows);
    }

  } catch (err) {
    console.error('❌ Error querying schema:', err);
  } finally {
    await client.end();
  }
}

getTableSchema();
