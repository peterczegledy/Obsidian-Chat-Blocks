"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => ChatAlignPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var ChatAlignPlugin = class extends import_obsidian.Plugin {
  onload() {
    this.registerMarkdownCodeBlockProcessor(
      "chat",
      async (source, el, ctx) => {
        const rawLines = source.split("\n").map((line) => line.trim()).filter((line) => line.length > 0);
        let chatName = "Chat";
        let lines = [...rawLines];
        const firstLine = rawLines[0];
        if (firstLine) {
          const titleMatch = firstLine.match(
            /^title\s*=\s*"(.+?)"$/i
          );
          if (titleMatch) {
            const title = titleMatch[1];
            if (title) {
              chatName = title;
              lines = rawLines.slice(1);
            }
          }
        }
        const wrapper = el.createDiv({
          cls: "chat-wrapper"
        });
        const header = wrapper.createDiv({
          cls: "chat-header"
        });
        const headerLeft = header.createDiv({
          cls: "chat-header-left"
        });
        headerLeft.createDiv({
          cls: "chat-back",
          text: "\u2190"
        });
        headerLeft.createDiv({
          cls: "chat-avatar",
          text: chatName.charAt(0).toUpperCase()
        });
        headerLeft.createDiv({
          cls: "chat-name",
          text: chatName
        });
        header.createDiv({
          cls: "chat-menu",
          text: "\u22EF"
        });
        const chatContainer = wrapper.createDiv({
          cls: "chat-container"
        });
        let alternateLeft = true;
        for (const line of lines) {
          const match = line.match(
            /^(l|r)\s*:\s*(.+)$/i
          );
          let side = alternateLeft ? "left" : "right";
          let text = line;
          if (match) {
            const direction = match[1];
            const message = match[2];
            if (direction && message) {
              side = direction.toLowerCase() === "l" ? "left" : "right";
              text = message;
            }
          } else {
            alternateLeft = !alternateLeft;
          }
          const bubble = chatContainer.createDiv({
            cls: side === "left" ? "chat-left" : "chat-right"
          });
          await import_obsidian.MarkdownRenderer.render(
            this.app,
            text,
            bubble,
            ctx.sourcePath,
            ctx
          );
        }
        const inputBar = wrapper.createDiv({
          cls: "chat-input-bar"
        });
        inputBar.createDiv({
          cls: "chat-plus",
          text: "+"
        });
        inputBar.createEl("textarea", {
          cls: "chat-input",
          attr: {
            placeholder: "Message..."
          }
        });
        inputBar.createDiv({
          cls: "chat-send",
          text: "\u27A4"
        });
      }
    );
  }
};
//# sourceMappingURL=main.js.map
