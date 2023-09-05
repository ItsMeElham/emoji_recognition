const textInput = document.getElementById('textInput');
const autoNarrateToggle = document.getElementById('autoNarrateToggle');
const doneButton = document.getElementById('doneButton');
const detailsDiv = document.getElementById('details');
const totalEmojisSpan = document.getElementById('totalEmojis');
const emojisAtStartSpan = document.getElementById('emojisAtStart');
const emojisAtEndSpan = document.getElementById('emojisAtEnd');
const emojiListItems = document.getElementById('emojiListItems');

async function fetchEmojiData() {
    try {
        const response = await fetch('https://unpkg.com/emoji.json@14.0.0/emoji.json');
        const emojiData = await response.json();
        return emojiData;
    } catch (error) {
        console.error('Error fetching emoji data:', error);
        return [];
    }
}

async function updateEmojiList(text) {
    emojiListItems.innerHTML = ''; // Clear previous list

    const emojiData = await fetchEmojiData();
    if (!emojiData) return;

    const emojiRegex = /([\uD800-\uDBFF][\uDC00-\uDFFF])/g;
    const emojis = text.match(emojiRegex) || [];

    emojis.forEach(emoji => {
        const emojiInfo = emojiData.find(item => item.char === emoji);
        if (emojiInfo) {
            const listItem = document.createElement('li');
            listItem.textContent = `${emoji} - ${emojiInfo.name}`;
            emojiListItems.appendChild(listItem);
        }
    });
}

function countEmojis(text) {
    const emojiRegex = /([\uD800-\uDBFF][\uDC00-\uDFFF])/g;
            
    const emojis = text.match(emojiRegex) || [];
    const totalEmojis = emojis.length;
    const emojisAtStart = totalEmojis > 0 && text.startsWith(emojis.join(''));
    const emojisAtEnd = totalEmojis > 0 && text.endsWith(emojis.join(''));

    return { totalEmojis, emojisAtStart, emojisAtEnd };
}

function narrateText(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
}

function Recognize() {
    const inputText = textInput.value;
    const { totalEmojis, emojisAtStart, emojisAtEnd } = countEmojis(inputText);

    totalEmojisSpan.textContent = totalEmojis;
    emojisAtStartSpan.textContent = emojisAtStart ? 'Yes' : 'No';
    emojisAtEndSpan.textContent = emojisAtEnd ? 'Yes' : 'No';

    if (autoNarrateToggle.checked) {
        narrateText(inputText);
    }

    updateEmojiList(inputText);

    detailsDiv.style.display = 'block';
}

doneButton.addEventListener('click', Recognize);

        
textInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
                Recognize();
    }
});