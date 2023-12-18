import { ChannelType, Message, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types";
import { validateInput, createUnpassedContractUnchecked, PassedContract } from "../bridge/calculator/calculator"
import scoreKeeper from "../bridge/calculator/ScoreKeeper"

const updateScoresReplies: (() => Promise<Message<boolean>>)[] = []

const calculateCommand : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("calculate")
    .setDescription("Calculates the score of a bridge contract.")
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
    })
    .addStringOption(option => {
        return option
        .setName("vulnerability")
        .setDescription("Vulnerability of declaring side.")
    }),
    execute: interaction => {
        const level = Number(interaction.options.get("level")!.value)
        const strain = String(interaction.options.get("strain")!.value)
        const tricksMadeOrDown = Number(interaction.options.get("tricks")!.value)
        const doubledState = interaction.options.get("doubled")?.value as string | undefined
        const vulnerability = interaction.options.get("vulnerability")?.value as string | undefined

        const invalidReason = validateInput(level, strain, tricksMadeOrDown, doubledState, vulnerability)
        if (invalidReason) {
            interaction.reply(invalidReason)
        } else {
            const contract = createUnpassedContractUnchecked(level, strain, tricksMadeOrDown, doubledState, vulnerability)
            interaction.reply(`Score: ${contract.score()}`)
        }
    },
}

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
    })
    .addStringOption(option => {
        return option
        .setName("vulnerability")
        .setDescription("Vulnerability of declaring side.")
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
     .setName("addpasscore")
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
    execute: interaction => {
        interaction.reply(scoreKeeper.table())
        const updateReply = () => interaction.editReply(scoreKeeper.table())
        updateScoresReplies.push(updateReply)
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

const calculateCommands = [
    calculateCommand,
    addScoreCommand,
    scoresCommand,
    addPassScoreCommand,
    removeLastScoreCommand,
]
export default calculateCommands