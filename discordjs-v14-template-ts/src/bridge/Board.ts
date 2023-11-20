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