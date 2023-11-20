import { PermissionFlagsBits } from "discord.js";
import { Command } from "../types";

const command : Command = {
    name: "bridge",
    execute: (message, args) => {
        const board = require("../bridge/board").default
        if (args.length < 2) {
            message.channel.send(`This call requires a parameter!`)
            return
        } else if (args[1] == "newgame") {
            board.shuffle()
        } else if (!board.handOptions.includes(args[1])) {
            message.channel.send(`Invalid parameter!`)
            return
        }
        let hands = board.handOptions.filter((option: string) =>
            args[1] == "newgame" || args[1] == option
        ).map((option: string) => 
                `${option.replace("-", " ")}\n||\`\`\`${board.getHand(option).diagram()}\`\`\`||`
            )
        const outputMessage = hands.join("\n")
        message.channel.send(`${outputMessage}`)
    },
    cooldown: 1,
    aliases: [],
    permissions: [] // to test
}

export default command