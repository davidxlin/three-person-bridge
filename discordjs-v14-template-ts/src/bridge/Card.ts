export class Card {
    static readonly suits = "SHDC".split("")
    static readonly ranks = "23456789TJQKA".split("")

    readonly suit: string
    readonly rank: string

    public constructor(suit: string, rank: string) {
        this.suit = suit
        this.rank = rank
    }

    public isHigherRank(card: Card): boolean {
        return Card.ranks.indexOf(this.rank) > Card.ranks.indexOf(card.rank)
    }

    public isHigherSuit(card: Card): boolean {
        return Card.suits.indexOf(this.suit) < Card.suits.indexOf(card.suit)
    }

    public toString(): string {
        return `${this.suit}${this.rank}`
    }
}