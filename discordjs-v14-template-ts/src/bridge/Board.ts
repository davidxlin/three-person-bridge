import { Card } from './Card'
import { Hand } from './Hand'

class Board {

    readonly handOptions = [
        "player1-hand",
        "player1-dummy-preview",
        "player2-hand",
        "player2-dummy-preview",
        "player3-hand",
        "player3-dummy-preview",
        "dummy-hand",
    ]

    private cards: Card[]

    public constructor() {
        this.cards = []
        Card.suits.forEach(suit => {
            Card.ranks.forEach(rank => {
                this.cards.push(new Card(suit, rank))
            })
        })
    }

    public shuffle() {
        this.shuffleArray(this.cards)
    }

    public getHand(option: string): Hand {
        switch (option) {
            case "player1-hand": { 
                return new Hand(this.cards.slice(0, 13))
            } 
            case "player2-hand": { 
                return new Hand(this.cards.slice(13, 26))
            }
            case "player3-hand": {
                return new Hand(this.cards.slice(26, 39))
            }
            case "dummy-hand": {
                return new Hand(this.cards.slice(39, 52))
            }
            case "player1-dummy-preview": {
                return new Hand(this.cards.slice(39, 43))
            }
            case "player2-dummy-preview": {
                return new Hand(this.cards.slice(43, 47))
            }
            case "player3-dummy-preview": {
                return new Hand(this.cards.slice(47, 51))
            }
            default: {
                throw new Error(`invalid getHand option: ${option}`)
            }
        }
    }

    public diagram(declarer: string): string {
        const north = this.getHand("dummy-hand")
        const south = this.getHand(`${declarer}-hand`)
        const east = (() => {
            switch (declarer) {
                case "player1":
                    return this.getHand("player3-hand")
                case "player2":
                    return this.getHand("player1-hand")
                case "player3":
                    return this.getHand("player2-hand")
                default:
                    throw new Error(`invalid declarer: ${declarer}`)
        }})()
        const west = (() => {
            switch (declarer) {
                case "player1":
                    return this.getHand("player2-hand")
                case "player2":
                    return this.getHand("player3-hand")
                case "player3":
                    return this.getHand("player1-hand")
                default:
                    throw new Error(`invalid declarer: ${declarer}`)
        }})()

        const formatNorthOrSouthHand = (hand: Hand) => 
            hand.diagram()
                .split("\n")
                .map((suit: string) => `${" ".repeat(13)}${suit.slice(3)}`)
                .join("\n")
        
        const westLines = west.diagram().split("\n")
        const eastLines = east.diagram().split("\n")
        const westAndEastLines = westLines.map((suit: string, i: number) => 
                `${suit.slice(3).padEnd(13)}${" ".repeat(13)}${eastLines[i].slice(3)}`
            )
            .join("\n")

        const northLines = formatNorthOrSouthHand(north)
        const southLines = formatNorthOrSouthHand(south)
        return `${northLines}\n${westAndEastLines}\n${southLines}`
    }

    private shuffleArray(array: Object[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }
}

const board = new Board()
export default board