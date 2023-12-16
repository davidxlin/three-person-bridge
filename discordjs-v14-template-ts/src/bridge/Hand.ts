import { Card } from './Card'

export class Hand {
    readonly cards: Card[]

    public constructor(cards: Card[]) {
        this.cards = cards.sort((card1, card2) => {
            if (card1.suit == card2.suit) {
                if (card1.rank == card2.rank) {
                    return 0
                } else if (card1.isHigherRank(card2)) {
                    return -1
                } else {
                    return 1
                }
            } else if (card1.isHigherSuit(card2)) {
                return -1
            } else {
                return 1
            }
        })
    }
}