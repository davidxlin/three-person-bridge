import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CacheType, ChatInputCommandInteraction, ComponentType, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types";
import { Card } from "../bridge/Card";
import { Hand } from "../bridge/Hand";
import board from "../bridge/Board"

const boardInteractions : any[] = []

const shuffleCommand: SlashCommand = {
    command: new SlashCommandBuilder()
     .setName("shuffle")
     .setDescription("Start a new game."),
     execute: interaction => {
        board.shuffle()
        boardInteractions.length = 0
        interaction.reply("New game sucessfully loaded in backend.")
     }
}

const createInteractableHand = async (interaction: ChatInputCommandInteraction, hand: Hand, message: string) => {
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
            })()
        })]))
    const buttons = Array.from(stringToButtonMap.values())
    const rows = []
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
        // interaction.editReply({ content: "Click a button", components: rows[0] });
        boardInteractions.forEach(tuple => {
            tuple[0].editReply(`\`\`\`${board.diagram(tuple[1], tuple[2])}\`\`\``)
        })
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
        createInteractableHand(interaction, hand, message)
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

const boardCommand: SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("board")
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
    }),
    execute: interaction => {
        const southPlayer = Number(interaction.options.get("player")!.value)
        const declarer = Number(interaction.options.get("declarer")!.value)
        interaction.reply(`\`\`\`${board.diagram(`player${southPlayer}`, `player${declarer}`)}\`\`\``)
        boardInteractions.push([interaction, `player${southPlayer}`, `player${declarer}`])
    }
}

const claimCommand: SlashCommand = {
    command: new SlashCommandBuilder()
     .setName("claim")
     .setDescription("Reveals all played cards."),
     execute: interaction => {
        board.claim()
        boardInteractions.forEach(tuple => {
            tuple[0].editReply(`\`\`\`${board.diagram(tuple[1], tuple[2])}\`\`\``)
        })
        interaction.reply("Successfully revealed all cards.")
     }
}

const bridgeCommands = [
    shuffleCommand,
    handCommand,
    dummyCommand,
    dummyPreviewCommand,
    boardCommand,
    claimCommand,
]
export default bridgeCommands;