import { PermissionFlagsBits } from "discord.js";
import { Command } from "../types";

const command : Command = {
    name: "bridge",
    execute: (message, args) => {
        const board = require("../bridge/board").default
        message.channel.send("Hello World!")
    },
    cooldown: 1,
    aliases: [],
    permissions: [] // to test
}

export default command