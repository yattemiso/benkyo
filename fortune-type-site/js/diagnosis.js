// このファイルはMBTI診断のロジックを実装するためのJavaScriptファイルです。

// ユーザーの質問に対する回答を格納する配列
const answers = [];

// 質問のリスト
const questions = [
    "あなたは社交的ですか？ (はい/いいえ)",
    "あなたは計画を立てるのが好きですか？ (はい/いいえ)",
    "あなたは新しい経験を楽しむ方ですか？ (はい/いいえ)",
    "あなたは論理的に考える方ですか？ (はい/いいえ)",
    "あなたは他人の感情に敏感ですか？ (はい/いいえ)"
];

// 質問を表示する関数
function displayQuestion(index) {
    if (index < questions.length) {
        const questionElement = document.getElementById("question");
        questionElement.textContent = questions[index];
    } else {
        calculateResult();
    }
}

// ユーザーの回答を保存する関数
function saveAnswer(answer) {
    answers.push(answer);
    displayQuestion(answers.length);
}

// 結果を計算して表示する関数
function calculateResult() {
    let type = "";
    // 簡易的な診断ロジック
    const yesCount = answers.filter(answer => answer === "はい").length;

    if (yesCount >= 3) {
        type = "E"; // 外向型
    } else {
        type = "I"; // 内向型
    }

    // 結果を表示
    const resultElement = document.getElementById("result");
    resultElement.textContent = `あなたのタイプは: ${type}`;
}

// 回答パターンごとの診断結果です。
// 「はい」を1、「いいえ」を2として、3問分の組み合わせで結果を選びます。
const diagnosisResults = {
  "111": ["おひさまチャレンジャー", "人との交流や計画を楽しみ、気持ちを大切にするタイプです。", "☀️"],
  "112": ["きらめきプランナー", "人との交流や計画が好きで、落ち着いて行動するタイプです。", "✨"],
  "121": ["ひらめきムードメーカー", "人との交流を楽しみ、自分の気持ちを大切にするタイプです。", "🌈"],
  "122": ["マイペース探検家", "人との交流を楽しみながら、自分らしいペースで進むタイプです。", "🧭"],
  "211": ["そっと支える計画家", "計画を立てるのが得意で、人の気持ちにも気づけるタイプです。", "🌷"],
  "212": ["こつこつ探検家", "計画を立てながら、自分らしく着実に進むタイプです。", "🐾"],
  "221": ["じっくり発想家", "自分のペースを大切にしながら、人の気持ちにも寄り添うタイプです。", "🌙"],
  "222": ["おだやか観察者", "落ち着いて周りを見ながら、自分らしく過ごすタイプです。", "🕊️"]
};

const form = document.getElementById("diagnosis-form");

if (form) {
  form.addEventListener("submit", function (event) {
    // 通常のフォーム送信によるページ再読み込みを止めます。
    event.preventDefault();

    const formData = new FormData(form);
    const answers = ["q1", "q2", "q3"].map(name => formData.get(name));

    const pattern = answers
      .map(answer => answer === "yes" ? "1" : "2")
      .join("");

    const [typeName, description, illustration] = diagnosisResults[pattern];

    document.getElementById("result-title").textContent = typeName;
    document.getElementById("result-illustration").textContent = illustration;
    document.getElementById("result-text").textContent = description;

    const fortuneUrl = new URL("fortune.html", window.location.href);
    fortuneUrl.searchParams.set("type", typeName);
    document.getElementById("fortune-link").href = fortuneUrl.href;

    document.getElementById("result").hidden = false;
  });
}