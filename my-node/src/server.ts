import app from "./app";

const PORT = 8000;

// ✅ 0.0.0.0 으로 변경 (모든 네트워크 인터페이스에서 접속 허용)
app.listen(PORT, '0.0.0.0', () => {
    console.log(`서버가 http://0.0.0.0:${PORT} 에서 실행 중입니다.`);
});
// app.listen(PORT ,() => {
//     console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
// });