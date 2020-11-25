export class ChatMessage {
    author: string | null;
    recipient: string
    content: string
    timestamp: string;

    constructor(author: string | null, recipient: string, content: string, timestamp: string) {
        this.author = author;
        this.recipient = recipient;
        this.content = content;
        this.timestamp = timestamp
    }
}
