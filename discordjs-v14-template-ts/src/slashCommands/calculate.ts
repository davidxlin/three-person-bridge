import { ChannelType, ChatInputCommandInteraction, Message, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types";
import { validateInput, createUnpassedContractUnchecked, PassedContract } from "../bridge/calculator/calculator"
import scoreKeeper from "../bridge/calculator/ScoreKeeper"
import { FOURTEEN_MINUTES_IN_MILLIS } from "./values";

const updateScoresReplies: (() => Promise<Message<boolean>>)[] = []

const addScoreCommand : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("addscore")
    .setDescription("Adds a score.")
    .addStringOption(option => {
        return option
         .setName("declarer")
         .setDescription("The declarer's name.")
         .setRequired(true)
    })
    .addIntegerOption(option => {
        return option
        .setMaxValue(7)
        .setMinValue(1)
        .setName("level")
        .setDescription("Level of the contract.")
        .setRequired(true)
    })
    .addStringOption(option => {
        return option
        .setName("strain")
        .setDescription("Strain of the contract.")
        .setRequired(true)
        .addChoices(
            { name: "Clubs", value: "c" },
            { name: "Diamonds", value: "d" },
            { name: "Hearts", value: "h" },
            { name: "Spades", value: "s" },
            { name: "Notrump", value: "n" },
        )
    })
    .addIntegerOption(option => {
        return option
        .setMaxValue(7)
        .setMinValue(-13)
        .setName("tricks")
        .setDescription("Odd tricks made or down.")
        .setRequired(true)
    })
    .addStringOption(option => {
        return option
        .setName("doubled")
        .setDescription("Doubled state of the contract.")
        .addChoices(
            { name: "Undoubled", value: "u" },
            { name: "Doubled", value: "d" },
            { name: "Redoubled", value: "r" },
        )
    })
    .addStringOption(option => {
        return option
        .setName("vulnerability")
        .setDescription("Vulnerability of declaring side.")
        .addChoices(
            { name: "Non-vulnerable", value: "n" },
            { name: "Vulnerable", value: "v" },
        )
    }),
    execute: interaction => {
        const declarer = String(interaction.options.get("declarer")!.value)
        const level = Number(interaction.options.get("level")!.value)
        const strain = String(interaction.options.get("strain")!.value)
        const tricksMadeOrDown = Number(interaction.options.get("tricks")!.value)
        const doubledState = interaction.options.get("doubled")?.value as string | undefined
        const vulnerability = interaction.options.get("vulnerability")?.value as string | undefined

        const invalidReason = validateInput(level, strain, tricksMadeOrDown, doubledState, vulnerability)
        if (invalidReason) {
            interaction.reply(invalidReason)
        } else {
            const contract = createUnpassedContractUnchecked(level, strain, tricksMadeOrDown, doubledState, vulnerability, declarer)
            scoreKeeper.addContract(contract)
            interaction.reply("Successfully added score.")
            updateScoresReplies.forEach(callback => callback())
        }
    },
}

const addPassScoreCommand : SlashCommand = {
    command: new SlashCommandBuilder()
     .setName("addpassscore")
     .setDescription("Adds a pass score."),
     execute: interaction => {
        scoreKeeper.addContract(new PassedContract())
        interaction.reply("Successfully added score.")
        updateScoresReplies.forEach(callback => callback())
     }
}

const scoresCommand : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("scores")
    .setDescription("Displays the current score."),
    execute: async interaction => {
        const updateReply = () => interaction.editReply(scoreKeeper.table())
        updateScoresReplies.push(updateReply)
        
        await interaction.reply(scoreKeeper.table())
        // We cannot update the table after fifteen minutes, so we must
        // remove it from the update array before that
        setTimeout(() => {
            updateScoresReplies.splice(updateScoresReplies.indexOf(updateReply), 1)
            interaction.followUp("This score table is no longer being actively updated. Please use /scores for the current score table.")
        }, FOURTEEN_MINUTES_IN_MILLIS)
    }
}

const removeLastScoreCommand: SlashCommand = {
    command: new SlashCommandBuilder()
     .setName("removelastscore")
     .setDescription("Removes the last score."),
     execute: interaction => {
        scoreKeeper.removeLastContract()
        interaction.reply("Successfully removed last score.")
        updateScoresReplies.forEach(callback => callback())
     }
}

const calculateCommandsUnsafe = [
    addScoreCommand,
    scoresCommand,
    addPassScoreCommand,
    removeLastScoreCommand,
]

const calculateCommands = calculateCommandsUnsafe.map(command => {
    const newCommand = Object.assign({}, command)
    newCommand.execute = async interaction => {
        try {
            await command.execute(interaction)
        } catch (e: any) {
            console.log(`${e}`)
        }
    }
    return newCommand
})

export default calculateCommands