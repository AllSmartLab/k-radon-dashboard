const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;

// 정적 파일 제공 (build 폴더 내의 파일들)
app.use(express.static(path.join(__dirname, 'build')));

// 모든 라우팅 요청에 대해 index.html을 반환 (SPA 라우팅 지원)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`K-Radon App is running on port ${port}`);
});
