import { ChannelType, Message, PermissionFlagsBits, SlashCommandBuilder, DiscordAPIError } from "discord.js";
import { SlashCommand } from "../types";
import { validateInput, createUnpassedContractUnchecked, PassedContract } from "../bridge/calculator/calculator"
import scoreKeeper from "../bridge/calculator/ScoreKeeper"

const updateScoresReplies: (() => Promise<Message<boolean>>)[] = []

function updateScores(): boolean {
    let success = true
    let noErrors: boolean = true
    do {
        noErrors = true
        for (let i = 0; i < updateScoresReplies.length; i++) {
            try {
                updateScoresReplies[i]()
            } catch (e: any) {
                if (e instanceof DiscordAPIError) {
                    console.log(`Received error ${e}, removing score table from being updated`)
                    updateScoresReplies.splice(i)
                    noErrors = false
                    success = false
                    break;
                } else {
                    throw e;
                }
            }
        }
    } while (!noErrors)

    return success
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
            if (updateScores()) {
                interaction.reply("Successfully added score.")
            } else {
                interaction.reply("Please refresh /scores")
            }
        }
    },
}

const addPassScoreCommand : SlashCommand = {
    command: new SlashCommandBuilder()
     .setName("addpassscore")
     .setDescription("Adds a pass score."),
     execute: interaction => {
        scoreKeeper.addContract(new PassedContract())
        if (updateScores()) {
            interaction.reply("Successfully added score.")
        } else {
            interaction.reply("Please refresh /scores")
        }
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
        scoreKeeper.addContract(new PassedContract())
        if (updateScores()) {
            interaction.reply("Successfully removed last score.")
        } else {
            interaction.reply("Please refresh /scores")
        }
     }
}

const calculateCommands = [
    addScoreCommand,
    scoresCommand,
    addPassScoreCommand,
    removeLastScoreCommand,
]
export default calculateCommands