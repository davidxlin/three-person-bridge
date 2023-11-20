import { Card } from './Card'

export class Hand {
    readonly cards: Card[]

    public constructor(cards: Card[]) {
        this.cards = cards
    }

    private suitString(suit: string) {
        return this.cards.filter(card => card.suit == suit)
                        .sort((card1, card2) => {
                            if (card1.rank == card2.rank) {
                                return 0
                            } else if (card1.isHigherRank(card2)) {
                                return -1;
                            } else {
                                return 1;
                            }
                        })
                        .map(card => card.rank)
                        .join("")
                        .padEnd(13)
    }

    public diagram(): string {
        const spades = this.suitString("S")
        const hearts = this.suitString("H")
        const diamonds = this.suitString("D")
        const clubs = this.suitString("C")
        return `S: ${spades}\nH: ${hearts}\nD: ${diamonds}\nC: ${clubs}`
    }
}