import { MarkdownRenderer, Plugin } from "obsidian";

export default class ChatAlignPlugin extends Plugin {

    onload() {

        this.registerMarkdownCodeBlockProcessor(
            "chat",
            async (source, el, ctx) => {

                const rawLines = source
                    .split("\n")
                    .map((line) => line.trim())
                    .filter((line) => line.length > 0);

                let chatName = "Chat";
                let pfpUrl: string | null = null;
                let lines = [...rawLines];

                // HEADER OPTIONS
                let headerLines = true;

                while (headerLines && lines.length > 0) {

                    const line = lines[0];

                    // title = "Péter"
                    const titleMatch = line.match(
                        /^title\s*=\s*"(.+?)"$/i
                    );

                    // pfp = "https://example.com/profile.png"
                    const pfpMatch = line.match(
                        /^pfp\s*=\s*"(.+?)"$/i
                    );

                    if (titleMatch) {

                        const title = titleMatch[1];

                        if (title) {
                            chatName = title;
                        }

                        lines.shift();

                    } else if (pfpMatch) {

                        const url = pfpMatch[1];

                        if (url) {
                            pfpUrl = url;
                        }

                        lines.shift();

                    } else {

                        headerLines = false;
                    }
                }

                // WRAPPER
                const wrapper = el.createDiv({
                    cls: "chat-wrapper",
                });

                // HEADER
                const header = wrapper.createDiv({
                    cls: "chat-header",
                });

                const headerLeft = header.createDiv({
                    cls: "chat-header-left",
                });

                headerLeft.createDiv({
                    cls: "chat-back",
                    text: "←",
                });

                // AVATAR
                const avatar = headerLeft.createDiv({
                    cls: "chat-avatar",
                });

                if (pfpUrl) {

                    avatar.createEl("img", {
                        attr: {
                            src: pfpUrl,
                            alt: chatName,
                        },
                    });

                } else {

                    avatar.setText(
                        chatName.charAt(0).toUpperCase()
                    );
                }

                // NAME
                headerLeft.createDiv({
                    cls: "chat-name",
                    text: chatName,
                });

                // MENU
                header.createDiv({
                    cls: "chat-menu",
                    text: "⋯",
                });

                // CHAT
                const chatContainer = wrapper.createDiv({
                    cls: "chat-container",
                });

                let alternateLeft = true;

                for (const line of lines) {

                    const match = line.match(
                        /^(l|r)\s*:\s*(.+)$/i
                    );

                    let side: "left" | "right" = alternateLeft
                        ? "left"
                        : "right";

                    let text = line;

                    if (match) {

                        const direction = match[1];
                        const message = match[2];

                        if (direction && message) {

                            side =
                                direction.toLowerCase() === "l"
                                    ? "left"
                                    : "right";

                            text = message;
                        }

                    } else {

                        alternateLeft = !alternateLeft;
                    }

                    const bubble = chatContainer.createDiv({
                        cls:
                            side === "left"
                                ? "chat-left"
                                : "chat-right",
                    });

                    await MarkdownRenderer.render(
                        this.app,
                        text,
                        bubble,
                        ctx.sourcePath,
                        ctx
                    );
                }

                // INPUT BAR
                const inputBar = wrapper.createDiv({
                    cls: "chat-input-bar",
                });

                inputBar.createDiv({
                    cls: "chat-plus",
                    text: "+",
                });

                inputBar.createEl("textarea", {
                    cls: "chat-input",
                    attr: {
                        placeholder: "Message...",
                    },
                });

                inputBar.createDiv({
                    cls: "chat-send",
                    text: "➤",
                });
            }
        );
    }
}