// fortune.js
// このファイルは運勢占いのロジックを実装します。

// ユーザーが入力したタイプに基づいて運勢を計算し、表示する関数
function displayFortune(userType) {
    const fortunes = {
        'INTJ': '今日は計画的に行動することで良い結果が得られます。',
        'INFP': '感情を大切にし、周囲との調和を意識しましょう。',
        'ENTJ': 'リーダーシップを発揮するチャンスです。',
        'ESFJ': '人とのつながりを大切にし、サポートを求めましょう。',
        // 他のタイプの運勢を追加できます
    };

    const fortuneMessage = fortunes[userType] || 'あなたの運勢は未知数です。';
    document.getElementById('fortuneDisplay').innerText = fortuneMessage;
}

// ページが読み込まれたときに、ユーザーのタイプを取得して運勢を表示する
window.onload = function() {
    const userType = localStorage.getItem('userType'); // ユーザーのタイプをローカルストレージから取得
    if (userType) {
        displayFortune(userType);
    } else {
        document.getElementById('fortuneDisplay').innerText = 'タイプが設定されていません。';
    }
};

// 診断タイプごとの絵文字です。
const typeIllustrations = {
  "おひさまチャレンジャー": "☀️",
  "きらめきプランナー": "✨",
  "ひらめきムードメーカー": "🌈",
  "マイペース探検家": "🧭",
  "そっと支える計画家": "🌷",
  "こつこつ探検家": "🐾",
  "じっくり発想家": "🌙",
  "おだやか観察者": "🕊️"
};

// 運勢ごとに天気マーク・ひとこと・ラッキーアイテムを用意します。
const fortunes = [
  { weather: "☀️", label: "快晴", message: "小さな一歩が、うれしい発見につながりそう。", item: "お気に入りのペン" },
  { weather: "🌤️", label: "晴れのちくもり", message: "焦らず自分のペースで進めると、よい流れになりそう。", item: "温かい飲みもの" },
  { weather: "☀️", label: "晴れ", message: "誰かにかけた優しい言葉が、あなたにも返ってきそう。", item: "ハンカチ" },
  { weather: "🌈", label: "虹が見えるかも", message: "気になっていたことを始めるのに、よいタイミングです。", item: "ノート" },
  { weather: "☁️", label: "くもり", message: "今日は少しゆっくり過ごすと、気持ちが整いそう。", item: "好きなお菓子" },
  { weather: "🌦️", label: "ときどき雨", message: "予定どおりにいかなくても大丈夫。思いがけない発見がありそう。", item: "明るい色の小物" },
  { weather: "🌧️", label: "しっとり雨", message: "疲れを感じたら、無理をせずひと休みしてみて。休息が明日の力になります。", item: "お気に入りの音楽" },
  { weather: "🌤️", label: "雲の向こうに晴れ間", message: "身近な人との会話に、うれしいヒントがありそう。", item: "小さなアクセサリー" },
  { weather: "☀️", label: "晴れ", message: "片づけや整理をすると、気分もすっきりしそう。", item: "お気に入りの袋" },
  { weather: "🌙", label: "夜はゆったり", message: "自分のよいところをひとつ見つけると、心が明るくなりそう。", item: "笑顔" }
];

// URLから診断タイプを読み取ります。
const params = new URLSearchParams(window.location.search);
const typeName = params.get("type");

const fortuneContent = document.getElementById("fortune-content");
const noType = document.getElementById("no-type");

if (typeName && typeIllustrations[typeName]) {
  // 運勢の中からランダムにひとつ選びます。
  const fortune = fortunes[Math.floor(Math.random() * fortunes.length)];

  document.getElementById("type-illustration").textContent =
    typeIllustrations[typeName];
  document.getElementById("type-name").textContent = typeName;
  document.getElementById("weather-icon").textContent = fortune.weather;
  document.getElementById("weather-label").textContent =
    `今日の運気：${fortune.label}`;
  document.getElementById("fortune-message").textContent = fortune.message;
  document.getElementById("lucky-item").textContent =
    `ラッキーアイテム：${fortune.item}`;

  fortuneContent.hidden = false;
} else {
  // タイプが指定されていないときは、診断ページへの案内を表示します。
  noType.hidden = false;
}