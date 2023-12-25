import { ChannelType, ChatInputCommandInteraction, Message, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import {SlashCommand} from "../types";
import { Board } from '../monopoly/monopoly'
const tilesCommand: SlashCommand = {
    command: new SlashCommandBuilder()
     .setName("tiles")
     .setDescription("Displays all tile names."),
     execute: interaction => {
        const board = new Board()
        interaction.reply(`${board.getTileNames()}`)
     }
}

const monopolyCommands = [
    tilesCommand,
]

export default monopolyCommands