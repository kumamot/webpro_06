const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));

// 既存のルート
app.get("/hello1", (req, res) => {
  const message1 = "Hello world";
  const message2 = "Bon jour";
  res.render('show', { greet1: message1, greet2: message2 });
});

app.get("/hello2", (req, res) => {
  res.render('show', { greet1: "Hello world", greet2: "Bon jour" });
});

app.get("/icon", (req, res) => {
  res.render('icon', { filename: "./public/Apple_logo_black.svg", alt: "Apple Logo" });
});

app.get("/luck", (req, res) => {
  const num = Math.floor(Math.random() * 6 + 1);
  let luck = '';
  if (num == 1) luck = '大吉';
  else if (num == 2) luck = '中吉';
  console.log('あなたの運勢は' + luck + 'です');
  res.render('luck', { number: num, luck: luck });
});

app.get("/janken", (req, res) => {
  let hand = req.query.hand; // ニンゲンの手
  let win = Number(req.query.win); // 勝数
  let total = Number(req.query.total); // 試合数
  console.log({ hand, win, total });

  // CPUの手
  const num = Math.floor(Math.random() * 3 + 1);
  let cpu = '';
  if (num == 1) cpu = 'グー';
  else if (num == 2) cpu = 'チョキ';
  else cpu = 'パー';

  // 勝敗の判定
  let judgement = '';
  if (
    (hand === 'グー' && cpu === 'チョキ') ||
    (hand === 'チョキ' && cpu === 'パー') ||
    (hand === 'パー' && cpu === 'グー')
  ) {
    judgement = '勝ち';
    win += 1;
  } else if (hand === cpu) {
    judgement = '引き分け';
  } else {
    judgement = '負け';
  }

  total += 1;

  // 結果
  const display = {
    your: hand,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total
  };
  res.render('janken', display);
});

// 新しい機能: テキストの長さを返す
app.get("/text-length", (req, res) => {
  const text = req.query.text || ''; // ユーザー入力を取得
  const length = text.length; // 文字数を計算
  res.render("text-length", { text, length });
});

// 新しい機能: 年齢を計算する
app.get("/calculate-age", (req, res) => {
  const birthDate = req.query.birthYear; // クエリパラメータから日付を取得
  if (!birthDate) {
    res.render("calculate-age", { birthYear: null, age: "入力が必要です" });
    return;
  }

  const birthDateObj = new Date(birthDate); // 生年月日をDate型に変換
  const today = new Date(); // 現在の日付

  let age = today.getFullYear() - birthDateObj.getFullYear(); // 年齢を計算
  const birthMonth = birthDateObj.getMonth();
  const birthDay = birthDateObj.getDate();
  
  // 現在の月や日が、生年月日より前の場合は年齢を1つ減らす
  if (
    today.getMonth() < birthMonth || 
    (today.getMonth() === birthMonth && today.getDate() < birthDay)
  ) {
    age -= 1;
  }

  res.render("calculate-age", { birthYear: birthDate, age });
});



// サーバーの起動
app.listen(8080, () => console.log("Example app listening on port 8080!"));
