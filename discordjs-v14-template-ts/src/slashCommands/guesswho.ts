import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    ComponentType,
    SlashCommandBuilder,
} from "discord.js";
import {SlashCommand} from "../types";
import { people } from '../guesswho/people'
import { commits } from '../guesswho/commits'
import { Save } from '../guesswho/save'
import { FOURTEEN_MINUTES_IN_MILLIS } from "./values";

const saves = new Map<string, Save>()
const expireCallbacks = new Map<string, () => void>()

const createGuesswhoBoard = async (interaction: ChatInputCommandInteraction, saveKey: string, message: string) => {
    const guesswhoPersonButtonPrefix = 'guesswhoPerson'
    const upStyle = ButtonStyle.Primary
    const downStyle = ButtonStyle.Secondary

    const save = saves.get(saveKey) ?? new Save()
    saves.set(saveKey, save)

    const personToButtonMap = new Map(people
        .map((person: string) => [
            person,
            new ButtonBuilder({
                customId: `${guesswhoPersonButtonPrefix}${person}`,
                label: save.isUp(person) ? person : Array.from(person).map(c => `${c}\u0336`).join(""),
                style: save.isUp(person) ? upStyle : downStyle,
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
        save.toggle(person)
        button.setStyle(save.isUp(person) ? upStyle : downStyle)
        button.setLabel(save.isUp(person) ? person : Array.from(person).map(c => `${c}\u0336`).join(""))
        interaction.editReply({
            content: message,
            components: rows,
        })
        i.deferUpdate()
    })

    expireCallbacks.set(saveKey, () => {
        buttons.forEach(button => {button.setDisabled(true)})
        interaction.editReply({
            content: `This board under save key ${saveKey} is now expired!`,
            components: rows,
        })
    })
}

const peopleCommand: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("people")
        .setDescription("Get interactable buttons for each person.")
        .addStringOption(option => {
            return option
                .setName("savekey")
                .setDescription("The key under which the button states are saved.")
                .setRequired(true)
        }),
    execute: interaction => {
        const saveKey = String(interaction.options.get("savekey")!.value)
        const message = `Guess who people under save key ${saveKey}: `
        createGuesswhoBoard(interaction, saveKey, message)

        // The buttons stop after 15 minutes, so we must disable them before then.
        setTimeout(() => {
            const callback = expireCallbacks.get(saveKey)
            if (callback !== undefined) {
                callback()
            }
        }, FOURTEEN_MINUTES_IN_MILLIS)
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
        if (!commits.has(key)) {
            commits.set(key, commit)
            interaction.reply( {
                content: `Successfully commited to the key ${key}`,
                ephemeral: true,
            })
        } else {
            interaction.reply('No cheating cannot use the same key!')
        }
        
    }
}

const showCommitsCommand: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("showcommits")
        .setDescription("Show all commitments."),
    execute: interaction => {
        const array = Array.from(commits).map(key => `- ${key}`)
        interaction.reply(`Commitments:\n${array.join('\n')}`)
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