export class Card {
    readonly suit: string
    readonly rank: string

    public constructor(suit: string, rank: string) {
        this.suit = suit;
        this.rank = rank;
      }
}