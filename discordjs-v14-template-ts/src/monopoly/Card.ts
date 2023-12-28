export abstract class Card {
    readonly description: string
    constructor(description: string) {
        this.description = description
    }
}

export class ChanceCard extends Card {}
export class CommunityChestCard extends Card {}