import { ChannelType, ChatInputCommandInteraction, Message, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import {SlashCommand} from "../types";
import board from '../monopoly/board'
const tilesCommand: SlashCommand = {
    command: new SlashCommandBuilder()
     .setName("tiles")
     .setDescription("Displays all tile names."),
     execute: interaction => {
        interaction.reply(board.getTileNames().join('\n'))
     }
}

const tileInfoCommand: SlashCommand = {
    command: new SlashCommandBuilder()
     .setName("tileinfo")
     .setDescription("Gets a tile's information")
     .addStringOption(option => {
        return option
        .setName("name")
        .setDescription("The tile's name.")
        .setRequired(true)
    }),
    execute: interaction => {
        const name: string = interaction.options.get("name")!.value as string
        interaction.reply(`${board.getTileByName(name)}`)
    }
}

const playerInfoCommand: SlashCommand = {
    command: new SlashCommandBuilder()
     .setName("playerinfo")
     .setDescription("Gets a player's information")
     .addStringOption(option => {
        return option
        .setName("name")
        .setDescription("The player's name.")
        .setRequired(true)
    }),
    execute: interaction => {
        const name: string = interaction.options.get("name")!.value as string
        interaction.reply(`${board.getPlayerByName(name)}`)
    }
}

const chanceCommand: SlashCommand = {
    command: new SlashCommandBuilder()
     .setName("chance")
     .setDescription("Get all chance card descriptions."),
    execute: interaction => {
        interaction.reply(board.getChanceDescriptions().join('\n'))
    }
}

const communityChestCommand: SlashCommand = {
    command: new SlashCommandBuilder()
     .setName("communitychest")
     .setDescription("Get all community chest card descriptions."),
    execute: interaction => {
        interaction.reply(board.getCommunityChestDescriptions().join('\n'))
    }
}

const drawChanceCommand: SlashCommand = {
    command: new SlashCommandBuilder()
     .setName("drawchance")
     .setDescription("Draw a chance card."),
    execute: interaction => {
        interaction.reply(board.drawChance().description)
    }
}

const drawCommunityChestCommand: SlashCommand = {
    command: new SlashCommandBuilder()
     .setName("drawcommunitychest")
     .setDescription("Draw a community chest card."),
    execute: interaction => {
        interaction.reply(board.drawCommunityChest().description)
    }
}

const diceCommand: SlashCommand = {
    command: new SlashCommandBuilder()
     .setName("dice")
     .setDescription("Roll the dice."),
    execute: interaction => {
        interaction.reply(`${board.diceRoll()}`)
    }
}

const addPlayerCommand: SlashCommand = {
    command: new SlashCommandBuilder()
     .setName("addplayer")
     .setDescription("Add a player to monopoly.")
     .addStringOption(option => {
        return option
        .setName("name")
        .setDescription("The player's name.")
        .setRequired(true)
    }),
    execute: interaction => {
        const name: string = interaction.options.get("name")!.value as string
        board.addPlayer(name)
        interaction.reply(`Successfully added ${name} to monopoly.`)
    }
}

const addMoneyCommand: SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("addmoney")
    .setDescription("Add money to a player.")
    .addStringOption(option => {
        return option
        .setName("name")
        .setDescription("The player's name.")
        .setRequired(true)
    })
    .addIntegerOption(option => {
       return option
       .setName("money")
       .setDescription("The amount of money.")
       .setRequired(true)
   }),
   execute: interaction => {
       const name: string = interaction.options.get("name")!.value as string
       const money: number = interaction.options.get("money")!.value as number
       if (board.addMoney(name, money)) {
        interaction.reply(`Successfully added ${money} money to player ${name}.`)
       } else {
        interaction.reply("Invalid input.")
       }
   }
}

const addGetOutOfJailFreeCardsCommand: SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("addgetoutofjailfreecards")
    .setDescription("Add Get Out Of Jail Free cards to a player.")
    .addStringOption(option => {
        return option
        .setName("name")
        .setDescription("The player's name.")
        .setRequired(true)
    })
    .addIntegerOption(option => {
       return option
       .setName("quantity")
       .setDescription("The number of Get Out Of Jail Free Cards.")
       .setRequired(true)
   }),
   execute: interaction => {
       const name: string = interaction.options.get("name")!.value as string
       const quantity: number = interaction.options.get("quantity")!.value as number
       if (board.addGetOutOfJailFreeCards(name, quantity)) {
        interaction.reply(`Successfully added ${quantity} Get Out Of Jail Free Cards to player ${name}.`)
       } else {
        interaction.reply("Invalid input.")
       }
   }
}

const setPositionCommand: SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("setposition")
    .setDescription("Set's a a player's position.")
    .addStringOption(option => {
        return option
        .setName("name")
        .setDescription("The player's name.")
        .setRequired(true)
    })
    .addStringOption(option => {
       return option
       .setName("position")
       .setDescription("The position.")
       .setRequired(true)
   }),
   execute: interaction => {
       const name: string = interaction.options.get("name")!.value as string
       const position: string = interaction.options.get("position")!.value as string
       if (board.setPosition(name, position)) {
        interaction.reply(`Successfully set player ${name}'s position to ${position}.`)
       } else {
        interaction.reply("Invalid input.")
       }
   }
}

const addPropertyCommand: SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("addproperty")
    .setDescription("Add property to a player.")
    .addStringOption(option => {
        return option
        .setName("name")
        .setDescription("The player's name.")
        .setRequired(true)
    })
    .addStringOption(option => {
       return option
       .setName("property")
       .setDescription("The property's name")
       .setRequired(true)
   }),
   execute: interaction => {
       const name: string = interaction.options.get("name")!.value as string
       const propertyName: string = interaction.options.get("property")!.value as string
       if (board.addProperty(name, propertyName)) {
        interaction.reply(`Successfully added ${propertyName} money to player ${name}.`)
       } else {
        interaction.reply("Invalid input.")
       }
   }
}

const removePropertyCommand: SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("removeproperty")
    .setDescription("Remove property to a player.")
    .addStringOption(option => {
        return option
        .setName("name")
        .setDescription("The player's name.")
        .setRequired(true)
    })
    .addStringOption(option => {
       return option
       .setName("property")
       .setDescription("The property's name")
       .setRequired(true)
   }),
   execute: interaction => {
       const name: string = interaction.options.get("name")!.value as string
       const propertyName: string = interaction.options.get("property")!.value as string
       if (board.removeProperty(name, propertyName)) {
        interaction.reply(`Successfully added ${propertyName} money to player ${name}.`)
       } else {
        interaction.reply("Invalid input.")
       }
   }
}

const setMortgagedCommand: SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("setmortgaged")
    .setDescription("Set the mortgaged state of a property.")
    .addStringOption(option => {
        return option
        .setName("name")
        .setDescription("The property's name.")
        .setRequired(true)
    })
    .addBooleanOption(option => {
        return option
         .setName("mortgaged")
         .setDescription("The mortgaged state of the property")
         .setRequired(true)
    }),
    execute: interaction => {
        const name: string = interaction.options.get("name")!.value as string
        const mortgaged: boolean = interaction.options.get("mortgaged")!.value as boolean
        if (board.setMortgaged(name, mortgaged)) {
            interaction.reply(`Successfully set ${name} to have mortgaged state ${mortgaged}`)
        } else {
            interaction.reply("Invalid input.")
        }
    }
}

const setHousesCommand: SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("sethouses")
    .setDescription("Set the number of houses on a property.")
    .addStringOption(option => {
        return option
        .setName("name")
        .setDescription("The property's name.")
        .setRequired(true)
    })
    .addIntegerOption(option => {
        return option
         .setName("houses")
         .setDescription("The number of houses.")
         .setRequired(true)
    }),
    execute: interaction => {
        const name: string = interaction.options.get("name")!.value as string
        const houses: number = interaction.options.get("houses")!.value as number
        if (board.setNumHouses(name, houses)) {
            interaction.reply(`Successfully set ${name} to have ${houses} houses`)
        } else {
            interaction.reply("Invalid input.")
        }
    }
}

const monopolyCommandsUnsafe = [
    tilesCommand,
    tileInfoCommand,
    playerInfoCommand,
    chanceCommand,
    communityChestCommand,
    drawChanceCommand,
    drawCommunityChestCommand,
    diceCommand,
    addPlayerCommand,
    addMoneyCommand,
    addGetOutOfJailFreeCardsCommand,
    setPositionCommand,
    addPropertyCommand,
    removePropertyCommand,
    setMortgagedCommand,
    setHousesCommand,
]

const monopolyCommands = monopolyCommandsUnsafe.map(command => {
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

export default monopolyCommands