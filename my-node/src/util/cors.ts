// config/cors.js
const cors = require("cors");

exports.options = cors({
    origin: [
        "http://localhost:3000",
        "http://3.25.237.8",
        "https://module-storage-gt8d.vercel.app"
        // "https://asre.cheilelec.com", // 배포 도메인 추가
    ],
    credentials: true,
});