import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    ComponentType,
    SlashCommandBuilder
} from "discord.js";
import {SlashCommand} from "../types";
import { people } from '../guesswho/people'
import { commits } from '../guesswho/commits'

const createGuesswhoBoard = async (interaction: ChatInputCommandInteraction, message: string) => {
    const guesswhoPersonButtonPrefix = 'guesswhoPerson'
    const evenPressedStyle = ButtonStyle.Primary
    const oddPressedStyle = ButtonStyle.Secondary
    const personToButtonMap = new Map(people
        .map((person: string) => [
            person,
            new ButtonBuilder({
                customId: `${guesswhoPersonButtonPrefix}${person}`,
                label: person,
                style: evenPressedStyle,
            })
        ]))
    const buttons = Array.from(personToButtonMap.values())
    const rows: ActionRowBuilder<ButtonBuilder>[] = []
    for (let i = 0; i < buttons.length; i += 5) {
        const row = new ActionRowBuilder<ButtonBuilder>({
            components: buttons.slice(i, Math.min(buttons.length, i + 5)),
        })
        rows.push(row)
    }
    const response = await interaction.reply({
        content: message,
        components: rows,
    });

    const collector = response.createMessageComponentCollector({
        componentType: ComponentType.Button
    });

    collector.on("collect", (i) => {
        const id = i.customId;
        const person = id.substring(guesswhoPersonButtonPrefix.length)
        const button = personToButtonMap.get(person)!
        const oddPressed = button.data.style! == evenPressedStyle
        button.setStyle(oddPressed ? oddPressedStyle : evenPressedStyle)
        button.setLabel(oddPressed ? Array.from(person).map(c => `${c}\u0336`).join("") : person)
        interaction.editReply({
            content: message,
            components: rows,
        })
        i.deferUpdate()
    })
}

const peopleCommand: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("people")
        .setDescription("Get interactable buttons for each person."),
    execute: interaction => {
        const message = "Guess who people: "
        createGuesswhoBoard(interaction, message)
    }
}

const commitCommand: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("commit")
        .setDescription("Make a commitment.")
        .addStringOption(option => {
            return option
                .setName("key")
                .setDescription("The key")
                .setRequired(true)
        })
        .addStringOption(option => {
            return option
                .setName("commitment")
                .setDescription("The commitment")
                .setRequired(true)
        }),
    execute: interaction => {
        const key = String(interaction.options.get("key")!.value)
        const commit = String(interaction.options.get("commitment")!.value)
        commits.set(key, commit)
        interaction.reply(`Successfully commited to the key ${key}`)
    }
}

const showCommitsCommand: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("showcommits")
        .setDescription("Show all commitments."),
    execute: interaction => {
        const array= Array.from(commits).map(key => `${key}\t`)
        interaction.reply(`Commitments: ${array}`)
    }
}

const guesswhoCommandsUnsafe = [
    peopleCommand,
    commitCommand,
    showCommitsCommand,
]

const guesswhoCommands = guesswhoCommandsUnsafe.map(command => {
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

export default guesswhoCommands