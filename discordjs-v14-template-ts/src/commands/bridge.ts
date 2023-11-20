import { PermissionFlagsBits } from "discord.js";
import { Command } from "../types";
import { Board } from "../bridge/Board";

const command : Command = {
    name: "bridge",
    execute: (message, args) => {
        const board = new Board()
        Board.getHandOptions.forEach(option => {
            message.channel.send(option)
            message.channel.send(`||${board.getHand(option).diagram()}||`)
        })
    },
    cooldown: 10,
    aliases: [],
    permissions: ["Administrator", PermissionFlagsBits.ManageEmojisAndStickers] // to test
}

export default command