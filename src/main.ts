import { Plugin } from "obsidian";

export default class ChatAlignPlugin extends Plugin {
	onload() {
		this.registerMarkdownCodeBlockProcessor(
			"chat",
			(source, el) => {
				const rawLines = source
					.split("\n")
					.map((line) => line.trim())
					.filter((line) => line.length > 0);

				let chatName = "Chat";
				let lines = [...rawLines];

				// title="Valami"
				const firstLine = rawLines[0];

				if (firstLine) {
					const titleMatch = firstLine.match(
						/^title\s*=\s*"(.+?)"$/i
					);

					if (titleMatch) {
						chatName = titleMatch[1];
						lines = rawLines.slice(1);
					}
				}

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

				headerLeft.createDiv({
					cls: "chat-avatar",
					text: chatName.charAt(0).toUpperCase(),
				});

				headerLeft.createDiv({
					cls: "chat-name",
					text: chatName,
				});

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

					let side: "left" | "right";
					let text: string;

					if (match) {
						side =
							match[1].toLowerCase() === "l"
								? "left"
								: "right";

						text = match[2];
					} else {
						side = alternateLeft
							? "left"
							: "right";

						text = line;

						alternateLeft = !alternateLeft;
					}

					const bubble =
						chatContainer.createDiv({
							cls:
								side === "left"
									? "chat-left"
									: "chat-right",
						});

					bubble.setText(text);
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