import { ChannelType, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types";

const BridgeCommand : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("bridge")
    .setDescription("Let's play bridge!"),
    execute: interaction => {
        interaction.reply("Hello!")
    },
    cooldown: 10
}

export default BridgeCommand;