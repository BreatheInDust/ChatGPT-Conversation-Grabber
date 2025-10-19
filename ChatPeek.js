class ChatPeek {
    constructor(url) {
        this.url = url;
    }

    async fetchConversation() {
        if (!this.url) throw new Error("No URL provided");

        // Use a CORS proxy
        const proxy = 'https://api.allorigins.win/get?url=' + encodeURIComponent(this.url);
        let response;
        try {
            response = await fetch(proxy);
        } catch (e) {
            throw new Error("Failed to fetch URL via proxy");
        }

        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        const html = data.contents;

        // Extract __NEXT_DATA__ script content
        const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
        if (!match) throw new Error("Failed to find conversation JSON");

        let jsonData;
        try {
            jsonData = JSON.parse(match[1]);
        } catch (e) {
            throw new Error("Failed to parse JSON");
        }

        const serverData = jsonData.props?.pageProps?.serverResponse?.data;
        if (!serverData) throw new Error("Conversation data not found");

        const conversationData = serverData.linear_conversation || [];
        const aiTags = serverData.model?.tags || [];
        const aiName = aiTags.find(tag => tag.startsWith("gpt"))?.toUpperCase() || "GPT";
        const authorName = serverData.author_name || "User";

        const messages = conversationData.map(reply => {
            const text = (reply.message?.content?.parts || []).join(' ');
            const role = reply.message?.author?.role || "user";
            return {
                author: role === "user" ? authorName : aiName,
                type: role === "user" ? "human" : "ai",
                text
            };
        });

        return messages;
    }
}
