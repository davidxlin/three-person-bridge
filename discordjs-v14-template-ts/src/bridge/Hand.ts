import { Card } from './Card'

export class Hand {
    readonly cards: Card[]

    public constructor(cards: Card[]) {
        this.cards = cards
    }

    private suit(suit: string): Card[] {
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
    }
}