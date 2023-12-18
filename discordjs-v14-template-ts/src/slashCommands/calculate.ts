import { ChannelType, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types";
import { validateInput, createUnpassedContractUnchecked } from "../bridge/calculator/calculator"

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
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
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

export default calculateCommand 