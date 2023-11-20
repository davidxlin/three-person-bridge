import { Card } from './Card'

export class Hand {
    readonly cards: Card[]

    public constructor(cards: Card[]) {
        this.cards = cards
    }

    public diagram(): string {
        const spades = this.cards
                .filter(card => card.suit == "S")
                .sort()
                .map(card => card.rank)
        const hearts = this.cards
                .filter(card => card.suit == "H")
                .sort()
                .map(card => card.rank)
        const diamonds = this.cards
                .filter(card => card.suit == "D")
                .sort()
                .map(card => card.rank)
        const clubs = this.cards
                .filter(card => card.suit == "C")
                .sort()
                .map(card => card.rank)
        return `S: ${spades}\nH: ${hearts}\nD: ${diamonds}\nC: ${clubs}`
    }
}