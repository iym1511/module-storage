import app from "./app";

const PORT = process.env.PORT || 8000;

app.listen(8000,  () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});