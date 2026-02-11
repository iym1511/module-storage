import pool from "./util/db";

async function runProcedureTest() {
  const targetName = 'test_item';

  try {
    console.log("--- 프로시저 실행 전 데이터 확인 ---");
    // 초기값 확인
    const preRes = await pool.query("SELECT * FROM test_counts WHERE name = $1", [targetName]);
    if (preRes.rows.length === 0) {
        console.log("데이터가 없습니다. 초기화를 확인해주세요.");
        return;
    }
    console.log(`현재 카운트 (ID: ${preRes.rows[0].id}):`, preRes.rows[0].count);

    // CALL 명령어를 사용하여 프로시저 호출
    console.log("\n프로시저 호출 중: CALL p_increment_count($1)");
    await pool.query("CALL p_increment_count($1)", [targetName]);

    console.log("--- 프로시저 실행 후 데이터 확인 ---");
    const postRes = await pool.query("SELECT * FROM test_counts WHERE name = $1", [targetName]);
    console.log(`변경 후 카운트 (ID: ${postRes.rows[0].id}):`, postRes.rows[0].count);

  } catch (err) {
    console.error("프로시저 실행 오류:", err);
  } finally {
    // 테스트 종료 후 연결 해제
    await pool.end();
  }
}

runProcedureTest();
