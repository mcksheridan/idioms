import express from 'express';
import path from 'path';

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'src')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/html/index.html'));
});

app.listen(process.env.PORT || PORT);
