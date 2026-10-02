// main.js
// このファイルはサイト全体の基本的な機能を管理します。
// ページ間のナビゲーションや共通の処理を含みます。

document.addEventListener("DOMContentLoaded", function() {
    // ページ間のナビゲーションを管理する関数
    function setupNavigation() {
        const navLinks = document.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                const targetPage = this.getAttribute('href');
                loadPage(targetPage);
            });
        });
    }

    // 指定されたページを読み込む関数
    function loadPage(page) {
        fetch(page)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(html => {
                document.body.innerHTML = html;
                setupNavigation(); // 新しいページでもナビゲーションを設定
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }

    setupNavigation(); // 初期ナビゲーション設定
});