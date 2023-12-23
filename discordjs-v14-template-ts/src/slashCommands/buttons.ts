import { SlashCommandBuilder } from "discord.js";

const shuffleCommand: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("shuffle")
        .setDescription("Start a new game."),
    execute: interaction => {
        board.shuffle()
        updateBoardsReplies.length = 0
        interaction.reply("New game sucessfully loaded in backend.")
    }
}