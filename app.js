document.getElementById('fetchBtn').addEventListener('click', async () => {
    const link = document.getElementById('linkInput').value.trim();
    if (!link) return alert("Please enter a ChatGPT share link!");

    const cp = new ChatPeek(link);
    const container = document.getElementById('conversationContainer');
    container.innerHTML = 'Loading...';

    try {
        const messages = await cp.fetchConversation();
        container.innerHTML = '';

        messages.forEach(msg => {
            const div = document.createElement('div');
            div.className = 'message ' + msg.type;
            div.innerHTML = `<strong>${msg.author}:</strong> ${msg.text}`;
            container.appendChild(div);
        });
    } catch (err) {
        container.innerHTML = 'Failed to fetch conversation.';
        console.error(err);
    }
});

// Copy button functionality
document.getElementById('copyBtn').addEventListener('click', () => {
    const container = document.getElementById('conversationContainer');
    if (!container.textContent.trim()) return;

    navigator.clipboard.writeText(container.textContent)
        .then(() => alert("Conversation copied!"))
        .catch(() => alert("Failed to copy."));
});

