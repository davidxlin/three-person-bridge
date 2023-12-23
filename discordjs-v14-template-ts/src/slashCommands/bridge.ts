import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    CacheType,
    ChannelType,
    ChatInputCommandInteraction,
    ComponentType,
    GuildMember,
    GuildMemberRoleManager,
    Message,
    PermissionFlagsBits,
    SlashCommandBuilder
} from "discord.js";
import {SlashCommand} from "../types";
import {Card} from "../bridge/Card";
import {Hand} from "../bridge/Hand";
import {
    Guild,
} from "discord.js";
import board from "../bridge/Board"
import { FOURTEEN_MINUTES_IN_MILLIS } from "./values";
import test from "node:test";
import client from "../index"

const updateBoardsReplies: (() => Promise<Message<boolean>>)[] = []

const shuffleCommand: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("shuffle")
        .setDescription("Start a new game."),
    execute: interaction => {
        board.shuffle()
        updateBoardsReplies.length = 0
        interaction.reply("New game successfully loaded in backend.")
    }
}

const createInteractableHand = async (interaction: ChatInputCommandInteraction, hand: Hand, message: string, disableButtons = false) => {
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
            if (updateBoardsReplies.includes(updateReply)) {
                updateBoardsReplies.splice(updateBoardsReplies.indexOf(updateReply), 1)
                interaction.editReply("This board is no longer valid. Please use /board for the current board.")
            }
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
            if (updateBoardsReplies.includes(updateReply)) {
                updateBoardsReplies.splice(updateBoardsReplies.indexOf(updateReply), 1)
                interaction.editReply("This table is no longer valid. Please use /table for the current table.")
            }
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

function cardSlashCommandBuilder(name: string): Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> {
    return new SlashCommandBuilder()
        .setName(name)
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
        })
}

function getSuitAndRankFromOptionsChecked(interaction: ChatInputCommandInteraction<CacheType>): string[] | undefined {
    const suit = interaction.options.get("suit")!.value as string
    const rank = interaction.options.get("rank")!.value as string
    if (!Card.suits.includes(suit)) {
        interaction.reply(`Invalid suit: ${suit}`)
        return 
    }
    if (!Card.ranks.includes(rank)) {
        interaction.reply(`Invalid rank: ${suit}`)
        return 
    }
    return [suit, rank]
}

const unplayCommand: SlashCommand = {
    command: cardSlashCommandBuilder("unplay"),
    execute: interaction => {
        const suitAndRank = getSuitAndRankFromOptionsChecked(interaction)
        if (!suitAndRank) {
            return;
        }
        const suit = suitAndRank[0]
        const rank = suitAndRank[1]

        board.unplayCard(suit, rank)
        updateBoardsReplies.forEach(callback => callback())
        interaction.reply("Successfully unplayed the card.")
    }
}

const playCommand: SlashCommand = {
    command: cardSlashCommandBuilder("play"),
    execute: interaction => {
        const suitAndRank = getSuitAndRankFromOptionsChecked(interaction)
        if (!suitAndRank) {
            return;
        }
        const suit = suitAndRank[0]
        const rank = suitAndRank[1]

        board.playCard(suit, rank)
        updateBoardsReplies.forEach(callback => callback())
        interaction.reply("Successfully played the card.")
    }
}

function createCategory(categoryName: string, guild: Guild) {
    let category = guild.channels.cache.find(channel => channel.name === categoryName)

    if (category) {
        return category.id
    }

    guild.channels.create({
        name: categoryName,
        type: ChannelType.GuildCategory
    })
        .then((result) => {
                // @ts-ignore
                return result.id
            }
        ).catch(console.error);
}

/**
 * Create a private channel if it doesn't exist, viewable by those with the given role.
 */
async function createChannel(channelName: string, guild: Guild, categoryId: string, allowed: string) {
    let channel = guild.channels.cache.find(channel => channel.name === channelName)

    // Create channel if it doesn't exist already
    if (!channel) {
        let channel = await guild.channels.create({name: channelName})
        await channel.setParent(categoryId)

        const everyoneRole = guild.roles.everyone
        const allowedRole = guild.roles.cache.find(r => r.name === allowed)

        await channel.permissionOverwrites.edit(everyoneRole, {ViewChannel: false});
        if (allowedRole) {
            await channel.permissionOverwrites.edit(allowedRole, {ViewChannel: true});
        } else {
            console.log("e")
        }
    }

}

const createPlayerButtons = async (interaction: ChatInputCommandInteraction, guild: Guild) => {
    const player1Button = new ButtonBuilder()
        .setCustomId("1")
        .setLabel("Player 1")
        .setStyle(ButtonStyle.Primary)

    const player2Button = new ButtonBuilder()
        .setCustomId("2")
        .setLabel("Player 2")
        .setStyle(ButtonStyle.Primary)

    const player3Button = new ButtonBuilder()
        .setCustomId("3")
        .setLabel("Player 3")
        .setStyle(ButtonStyle.Primary)

    const row = new ActionRowBuilder<ButtonBuilder>(
        {components: [player1Button, player2Button, player3Button]})
    const rows: ActionRowBuilder<ButtonBuilder>[] = []
    rows.push(row)

    const message = "Game is ready to join"
    const response = await interaction.reply({
        content: message,
        components: rows,
    })

    const collector = response.createMessageComponentCollector({
        componentType: ComponentType.Button
    });
    collector.on("collect", (i) => {
        const id = i.customId;
        const buttonPressed = row.components[parseInt(id) - 1]
        buttonPressed.setDisabled(true)
        if (id === "1") {
            const player1Role = guild.roles.cache.find(r => r.name === "Player1")
            // @ts-ignore
            i.member?.roles.add(player1Role)
        } else if (id === "2") {
            const player2Role = guild.roles.cache.find(r => r.name === "Player2")
            // @ts-ignore
            i.member?.roles.add(player2Role)
        } else if (id === "3") {
            const player3Role = guild.roles.cache.find(r => r.name === "Player3")
            // @ts-ignore
            i.member?.roles.add(player3Role)
        }

        i.deferUpdate()
        interaction.editReply({
            content: message,
            components: rows,
        })


    })
}

// Set up a game by doing the following:
// - Create private channels for all players
// - Clear player1/player2/player3 roles from all people
// - Post message with buttons to allow people to gain a role
const startGameCommand: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("startgame")
        .setDescription("Start a game of Three Person Bridge"),
    execute: async interaction => {
        const guildId = interaction.guildId
        if (!guildId) {
            return
        }

        const guild = client.guilds.cache.get(guildId);
        if (!guild) {
            return
        }

        const player1Role = guild.roles.cache.find(r => r.name === "Player1")
        player1Role?.delete()
        await guild.roles.create({name: "Player1"})

        const player2Role = guild.roles.cache.find(r => r.name === "Player2")
        player2Role?.delete()
        await guild.roles.create({name: "Player2"})

        const player3Role = guild.roles.cache.find(r => r.name === "Player3")
        player3Role?.delete()
        await guild.roles.create({name: "Player3"})

        const categoryId = createCategory("Games", guild)
        if (categoryId) {
            await createChannel("game-player1", guild, categoryId, "Player1")
            await createChannel("game-player2", guild, categoryId, "Player2")
            await createChannel("game-player3", guild, categoryId, "Player3")
        }


        createPlayerButtons(interaction, guild)
    }
}

const bridgeCommandsUnsafe = [
    shuffleCommand,
    handCommand,
    dummyCommand,
    dummyPreviewCommand,
    boardCommand,
    tableCommand,
    claimCommand,
    unplayCommand,
    playCommand,
    startGameCommand,
]

const bridgeCommands = bridgeCommandsUnsafe.map(command => {
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

export default bridgeCommands;