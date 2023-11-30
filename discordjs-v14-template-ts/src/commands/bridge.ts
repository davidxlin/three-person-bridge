import { PermissionFlagsBits } from "discord.js";
import { Command } from "../types";

const command : Command = {
    name: "bridge",
    execute: (message, args) => {
        const helpString = 'See https://github.com/davidxlin/three-person-bridge for help.'
        const board = require("../bridge/board").default
        if (args.length < 2) {
            message.channel.send(`This call requires a parameter! ${helpString}`)
            return
        } else if (args[1] == "newgame") {
            board.shuffle()
        } else if (args[1] == "diagram") {
            if (args.length < 3) {
                message.channel.send(`This call requires the declarer to be entered as a parameter! ${helpString}`)
            }
            try {
                message.channel.send(`\`\`\`${board.diagram(args[2])}\`\`\``)
            } catch (e: any) {
                message.channel.send(`An error occured in producing the diagram`)
            }
            return
        } else if (!board.handOptions.includes(args[1])) {
            message.channel.send(`Invalid parameter! ${helpString}`)
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