document.getElementById('fetchBtn').addEventListener('click', async () => {
    const url = document.getElementById('linkInput').value.trim();
    if (!url) return alert('Please enter a valid link!');

    try {
        // Step 1: Use a CORS proxy
        const proxyUrl = "https://api.allorigins.win/get?url=" + encodeURIComponent(url);
        const response = await fetch(proxyUrl);
        const data = await response.json(); // allorigins returns JSON with a 'contents' field
        const html = data.contents;

        // Step 2: Extract the conversation JSON from the HTML
        const regex = /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/;
        const match = html.match(regex);
        if (!match) return alert('Could not extract conversation data.');

        const jsonData = JSON.parse(match[1]);
        const messages = jsonData.props.pageProps.messages || [];

        // Step 3: Display messages
        const container = document.getElementById('conversationContainer');
        container.innerHTML = '';
        messages.forEach(msg => {
            const div = document.createElement('div');
            div.classList.add('message');
            div.innerHTML = `<div class="${msg.author.role}">${msg.author.role}:</div><div class="text">${msg.content[0].text}</div>`;
            container.appendChild(div);
        });

    } catch (err) {
        console.error(err);
        alert('Failed to fetch conversation. Make sure the link is correct and public.');
    }
});

// Copy all conversation
document.getElementById('copyBtn').addEventListener('click', () => {
    const container = document.getElementById('conversationContainer');
    const textToCopy = Array.from(container.querySelectorAll('.message'))
                             .map(msg => msg.innerText).join('\n\n');
    navigator.clipboard.writeText(textToCopy);
    alert('Conversation copied!');
});
