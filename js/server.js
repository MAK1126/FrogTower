const express = require('express');
const app = express();
const path = require('path');

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'FrogTower')));

// 기본 경로 설정
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'FrogTower', 'index.html'));
});

// 서버 시작
const port = process.env.PORT || 5500;
app.listen(port, () => {
    console.log(`서버가 ${port} 포트에서 실행중입니다.`);
});