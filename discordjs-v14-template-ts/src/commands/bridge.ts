import { PermissionFlagsBits } from "discord.js";
import { Command } from "../types";
import { Board } from "../bridge/Board";

const command : Command = {
    name: "bridge",
    execute: (message, args) => {
        const board = new Board()
        const outputMessage = Board.handOptions.map(option => {
                return `${option}\n||\`\`\`${board.getHand(option).diagram()}\`\`\`||`
            })
            .join("\n")
        message.channel.send(`${outputMessage}`)
    },
    cooldown: 10,
    aliases: [],
    permissions: ["Administrator", PermissionFlagsBits.ManageEmojisAndStickers] // to test
}

export default command