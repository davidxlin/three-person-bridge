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
    private playedCards: Card[]

    public constructor() {
        this.cards = []
        Card.suits.forEach(suit => {
            Card.ranks.forEach(rank => {
                this.cards.push(new Card(suit, rank))
            })
        })
        this.playedCards = []
    }

    public shuffle() {
        const shuffleArray = (array: Object[]) => {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                const temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
        }
        shuffleArray(this.cards)
        this.playedCards = []
    }

    public playCard(suit: string, rank: string) {
        const card = this.cards.find(card => card.suit == suit && card.rank == rank)!
        if (!this.playedCards.includes(card)) {
            this.playedCards.push(card)
        }
    }

    public unplayCard(suit: string, rank: string) {
        const card = this.cards.find(card => card.suit == suit && card.rank == rank)!
        if (this.playedCards.includes(card)) {
            this.playedCards.splice(this.playedCards.indexOf(card), 1)
        }
    }

    public claim() {
        this.cards.forEach(card => this.playCard(card.suit, card.rank))
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

    private southNorthEastWestPlayedCards(southPlayer: string, declarer: string): Hand[] {
        const order = (() => {
            switch (declarer) {
                case "player1":
                    return ["player1", "player2", "dummy", "player3"]
                case "player2":
                    return ["player2", "player3", "dummy", "player1"]
                case "player3":
                    return ["player3", "player1", "dummy", "player2"]
                default:
                    throw new Error(`invalid declarer: ${declarer}`)
            }
        })()
        const filterPlayedCards = (hand: Hand) => new Hand(hand.cards.filter(card => this.playedCards.includes(card)))
        const south = filterPlayedCards(this.getHand(`${southPlayer}-hand`))
        const north = filterPlayedCards(this.getHand(`${order[(order.indexOf(southPlayer) + 2) % 4]}-hand`))
        const east = filterPlayedCards(this.getHand(`${order[(order.indexOf(southPlayer) + 3) % 4]}-hand`))
        const west = filterPlayedCards(this.getHand(`${order[(order.indexOf(southPlayer) + 1) % 4]}-hand`))
        return [south, north, east, west]
    }

    public tableDiagram(southPlayer: string, declarer: string): string {
        const [south, north, east, west] = this.southNorthEastWestPlayedCards(southPlayer, declarer)
        const topLine = `  ${north.cards.join(" ")}`
        const bottomLine = `  ${south.cards.join(" ")}`
        const middleLines = []
        for (let i = 0; i < 13; i++) {
            const westCardString = i < west.cards.length ? `${west.cards[i]}` : " "
            const eastCardString = i < east.cards.length ? `${east.cards[i]}` : " "
            middleLines.push(`${westCardString}${" ".repeat(39)}${eastCardString}`)
        }
        return `${topLine}\n${middleLines.join("\n")}\n${bottomLine}`
    }

    public diagram(southPlayer: string, declarer: string): string {
        const [south, north, east, west] = this.southNorthEastWestPlayedCards(southPlayer, declarer)

        const formatNorthOrSouthHand = (hand: Hand) => 
            hand.diagram()
                .split("\n")
                .map((suit: string) => `${" ".repeat(13)}${suit.slice(3).padEnd(13)}`)
                .join("\n")
        
        const westLines = west.diagram().split("\n")
        const eastLines = east.diagram().split("\n")
        const westAndEastLines = westLines.map((suit: string, i: number) => 
                `${suit.slice(3).padEnd(13)}${" ".repeat(13)}${eastLines[i].slice(3)}`
            )
            .join("\n")

        const northLines = formatNorthOrSouthHand(north)
        const southLines = formatNorthOrSouthHand(south)
        
        const history = `History: ${this.playedCards}\n\n`
        return `${history}${northLines}\n${westAndEastLines}\n${southLines}`
    }
}

const board = new Board()
export default board