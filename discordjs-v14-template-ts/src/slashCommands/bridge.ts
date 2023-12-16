import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types";
import { Card } from "../bridge/Card";
const BridgeCommand : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("bridge")
    .setDescription("Let's play bridge!"),
    execute: interaction => {
        const board = require("../bridge/board").default
        board.shuffle()
        const hand = board.getHand("player1-hand")
        const cards = hand.cards
        const buttons = hand.cards
                .map((card: Card) => new ButtonBuilder({
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
                }))
        const rows = []
        for (let i = 0; i < buttons.length; i += 5) {
            const row = new ActionRowBuilder<ButtonBuilder>({
                components: buttons.slice(i, Math.min(buttons.length, i+5)),
            })
            rows.push(row)
        }
        interaction.reply({
            content: `Prototype for displaying an interactable hand:`,
            components: rows,
        });
    },
    cooldown: 1
}

export default BridgeCommand;