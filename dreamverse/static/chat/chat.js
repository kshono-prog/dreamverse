document.addEventListener('DOMContentLoaded', function () {
    const sendMessageButton = document.getElementById('send-message-button');
    const messageContent = document.getElementById('message-content');
    const csrfToken = document.querySelector('#csrf-form input[name="csrfmiddlewaretoken"]').value;
    const messagesList = document.getElementById('messages-list');
    const username = messagesList.dataset.username;
    const languageSelect = document.getElementById('language-select');
    const backButton = document.getElementById('back-button');

    const changeLanguageButton = document.getElementById('change-language-button');


    // displayMessagesForSelectedLanguage関数を修正
    async function displayMessagesForSelectedLanguage() {
        const languageSelect = document.getElementById('language-select');
        const languageCode = languageSelect.value;

        // メッセージを取得して表示する処理
        try {
            const response = await fetch(`/get_messages/?language=${languageCode}`);
            const data = await response.json();

            messagesList.innerHTML = '';
            for (const message of data) {
                const messageElement = document.createElement('div');
                messageElement.textContent = `${message.username} : ${message.content}`;
                messagesList.appendChild(messageElement);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
    
        // Refreshボタンのイベントリスナーを追加
        const refreshButton = document.getElementById('refresh-button');
        refreshButton.addEventListener('click', refreshPage);
    });

    // Refreshボタンがクリックされたときにページをリロードする関数
    function refreshPage() {
        displayMessagesForSelectedLanguage();
    }

    async function sendMessage() {
        const content = messageContent.value;
        const username = messagesList.dataset.username;
        const languageCode = messagesList.dataset.languageCode;
    
        // 翻訳中のメッセージを表示
        const translatingMessage = document.getElementById('translating-message');
        translatingMessage.style.display = 'block';
    
        try {
            // メッセージを送信し、翻訳を待つ
            const response = await fetch('/send_message/', {
                method: 'POST',
                body: JSON.stringify({content: content, username: username, language: languageCode}),
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
            });
            const data = await response.json();
    
            // 翻訳が終わったら、翻訳中のメッセージを非表示にし、画面の内容を再表示する
            if (response.ok) {
                messageContent.value = '';
                displayMessagesForSelectedLanguage(languageCode);
            } else {
                console.error('Error sending message:', data.error);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            // 翻訳中のメッセージを非表示にする
            translatingMessage.style.display = 'none';
        }
    }
    // イベントリスナーの登録を修正
    languageSelect.addEventListener('change', () => displayMessagesForSelectedLanguage());

    messageContent.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage();
        }
    });

    languageSelect.addEventListener('change', displayMessagesForSelectedLanguage);

    backButton.addEventListener('click', function () {
        // 前の画面に戻る処理を実装
        window.history.back();
    });
});
