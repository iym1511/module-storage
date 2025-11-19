// config/cors.js
const cors = require("cors");

exports.options = cors({
    origin: [
        "http://localhost:3000",
        "http://52.62.87.2:8000",
        "https://module-storage-gt8d.vercel.app"
        // "https://asre.cheilelec.com", // 배포 도메인 추가
    ],
    credentials: true,
});