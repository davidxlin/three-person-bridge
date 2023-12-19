import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CacheType, ChatInputCommandInteraction, ComponentType, Message, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types";
import { Card } from "../bridge/Card";
import { Hand } from "../bridge/Hand";
import board from "../bridge/Board"
import { FOURTEEN_MINUTES_IN_MILLIS } from "./values";

const updateBoardsReplies: (() => Promise<Message<boolean>>)[] = []

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

const createInteractableHand = async (interaction: ChatInputCommandInteraction, hand: Hand, message: string, disableButtons=false) => {
    const stringToButtonMap = new Map(hand.cards
        .map((card: Card) => [
            `${card.suit}${card.rank}`,
            new ButtonBuilder({
            customId: `card${card.suit}${card.rank}`,
            label: `${card.rank}`,
            style: (() => {
                switch (card.suit) {
                    case "S": {
                        return ButtonStyle.Secondary
                    }
                    case "H": {
                        return ButtonStyle.Danger
                    }
                    case "D": {
                        return ButtonStyle.Primary
                    }
                    case "C": {
                        return ButtonStyle.Success
                    }
                    default: {
                        throw new Error(`invalid suit: ${card.suit}`)
                    }
                }
            })(),
            disabled: disableButtons,
        })]))
    const buttons = Array.from(stringToButtonMap.values())
    const rows: ActionRowBuilder<ButtonBuilder>[] = []
    for (let i = 0; i < buttons.length; i += 5) {
        const row = new ActionRowBuilder<ButtonBuilder>({
            components: buttons.slice(i, Math.min(buttons.length, i+5)),
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
        const suit = id[4]
        const rank = id[5]
        board.playCard(suit, rank)
        stringToButtonMap.get(`${suit}${rank}`)!.setDisabled(true)
        interaction.editReply({
            content: message,
            components: rows,
        })
        i.deferUpdate()
        updateBoardsReplies.forEach(callback => callback())
    })
}

const handCommand: SlashCommand = {
    command: new SlashCommandBuilder()
     .setName("hand")
     .setDescription("Get interactable hand.")
     .addIntegerOption(option => {
        return option
        .setName("player")
        .setMaxValue(3)
        .setMinValue(1)
        .setDescription("Player number")
        .setRequired(true)
     }),
     execute: async interaction => {
        const playerNumber = Number(interaction.options.get("player")!.value)
        const hand = board.getHand(`player${playerNumber}-hand`)
        const message = `Player ${playerNumber}'s interactable hand:`
        createInteractableHand(interaction, hand, message)
     }
}

const dummyPreviewCommand: SlashCommand = {
    command: new SlashCommandBuilder()
     .setName("dummypreview")
     .setDescription("Get dummy preview.")
     .addIntegerOption(option => {
        return option
         .setName("player")
         .setMaxValue(3)
         .setMinValue(1)
         .setDescription("Player number")
         .setRequired(true)
     }),
     execute: async interaction => {
        const playerNumber = Number(interaction.options.get("player")!.value)
        const hand = board.getHand(`player${playerNumber}-dummy-preview`)
        const message = `Player ${playerNumber}'s dummy preview:`
        createInteractableHand(interaction, hand, message, /* disableButtons= */ true)
     }
}

const dummyCommand: SlashCommand = {
    command: new SlashCommandBuilder()
     .setName("dummy")
     .setDescription("Get interactable dummy hand."),
     execute: async interaction => {
        const hand = board.getHand(`dummy-hand`)
        const message = `Dummy's interactable hand:`
        createInteractableHand(interaction, hand, message)
     }
}

const playerDeclarerCommandBuilder = (name: string) => 
    new SlashCommandBuilder()
    .setName(name)
    .setDescription("View played cards.")
    .addIntegerOption(option => {
    return option
        .setName("player")
        .setMaxValue(3)
        .setMinValue(1)
        .setDescription("Player number")
        .setRequired(true)
    })
    .addIntegerOption(option => {
        return option
        .setName("declarer")
        .setMaxValue(3)
        .setMinValue(1)
        .setDescription("Declarer's player number")
        .setRequired(true)
    })

const boardCommand: SlashCommand = {
    command: playerDeclarerCommandBuilder("board"),
    execute: async interaction => {
        const southPlayer = Number(interaction.options.get("player")!.value)
        const declarer = Number(interaction.options.get("declarer")!.value)
        const updateReply = () => interaction.editReply(`\`\`\`${board.diagram(`player${southPlayer}`, `player${declarer}`)}\`\`\``)
        updateBoardsReplies.push(updateReply)

        await interaction.reply(`\`\`\`${board.diagram(`player${southPlayer}`, `player${declarer}`)}\`\`\``)
        // We cannot update the board after fifteen minutes, so we must
        // remove it from the update array before that
        setTimeout(() => {
            updateBoardsReplies.splice(updateBoardsReplies.indexOf(updateReply))
            interaction.editReply("This board is no longer valid. Please use /board for the current board.")
        }, FOURTEEN_MINUTES_IN_MILLIS)
    }
}


const tableCommand: SlashCommand = {
    command: playerDeclarerCommandBuilder("table"),
    execute: async interaction => {
        const southPlayer = Number(interaction.options.get("player")!.value)
        const declarer = Number(interaction.options.get("declarer")!.value)
        const updateReply = () => interaction.editReply(`\`\`\`${board.tableDiagram(`player${southPlayer}`, `player${declarer}`)}\`\`\``)
        updateBoardsReplies.push(updateReply)
        
        await interaction.reply(`\`\`\`${board.tableDiagram(`player${southPlayer}`, `player${declarer}`)}\`\`\``)
        // We cannot update the board after fifteen minutes, so we must
        // remove it from the update array before that
        setTimeout(() => {
            updateBoardsReplies.splice(updateBoardsReplies.indexOf(updateReply))
            interaction.editReply("This table is no longer valid. Please use /table for the current table.")
        }, FOURTEEN_MINUTES_IN_MILLIS)
    }
}

const claimCommand: SlashCommand = {
    command: new SlashCommandBuilder()
     .setName("claim")
     .setDescription("Reveals all played cards."),
     execute: interaction => {
        board.claim()
        interaction.reply("Successfully revealed all cards.")
        updateBoardsReplies.forEach(callback => callback())
     }
}

const unplayCommand: SlashCommand = {
    command: new SlashCommandBuilder()
     .setName("unplay")
     .setDescription("Unplays a card.")
     .addStringOption(option => {
        return option
         .setName("suit")
         .setDescription("The suit of the card")
         .setRequired(true)
     })
     .addStringOption(option => {
        return option
         .setName("rank")
         .setDescription("The rank of the card")
         .setRequired(true)
     }),
     execute: interaction => {
        const suit = String(interaction.options.get("suit")!.value)
        const rank = String(interaction.options.get("rank")!.value)
        if (!Card.suits.includes(suit)) {
            interaction.reply(`Invalid suit: ${suit}`)
            return
        }
        if (!Card.ranks.includes(rank)) {
            interaction.reply(`Invalid rank: ${suit}`)
            return
        }
        board.unplayCard(suit, rank)
        updateBoardsReplies.forEach(callback => callback())
        interaction.reply("Successfully unplayed the card.")
     }
}

const bridgeCommands = [
    shuffleCommand,
    handCommand,
    dummyCommand,
    dummyPreviewCommand,
    boardCommand,
    tableCommand,
    claimCommand,
    unplayCommand,
]
export default bridgeCommands;