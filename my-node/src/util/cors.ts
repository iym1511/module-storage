// config/cors.js
const cors = require("cors");

exports.options = cors({
    origin: [
        "http://localhost:3000",
        // "https://asre.cheilelec.com", // 배포 도메인 추가
    ],
    credentials: true,
});