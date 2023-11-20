import { PermissionFlagsBits } from "discord.js";
import { Command } from "../types";

const command : Command = {
    name: "bridge",
    execute: (message, args) => {
        message.channel.send(`I like to play three person bridge!`)
    },
    cooldown: 10,
    aliases: [],
    permissions: ["Administrator", PermissionFlagsBits.ManageEmojisAndStickers] // to test
}

export default command