export abstract class Tile {
    public readonly name: string
    public readonly position: number
    constructor(name: string, position: number) {
        this.name = name
        this.position = position
    }

    public toString(): string {
        return `${this.constructor.name}(name=${this.name})`
    }
}

export class PropertyTile extends Tile {
    public readonly price: number
    public mortgaged: boolean = false
    constructor(name: string, position: number, price: number) {
        super(name, position)
        this.price = price
    }

    public toString(): string {
        return `${this.constructor.name}(name=${this.name},price=${this.price},mortgaged=${this.mortgaged})`
    }
}
export class ColorTile extends PropertyTile {
    public readonly color: string
    public readonly rent: number[]
    public readonly houseCost: number
    public numHouses: number = 0
    constructor(name: string, position: number, price: number, color: string, rent: number[], houseCost: number) {
        super(name, position, price)
        this.color = color
        this.rent = rent
        this.houseCost = houseCost
    }

    public toString(): string {
        return `${this.constructor.name}(name=${this.name},price=${this.price},rent=${this.rent},color=${this.color},houseCost=${this.houseCost},mortgaged=${this.mortgaged},numHouses=${this.numHouses})`
    }
}

export class RailroadTile extends PropertyTile {}

export class UtilityTile extends PropertyTile {}

export class ChanceTile extends Tile {}

export class CommunityChestTile extends Tile {}

export class TaxTile extends Tile {
    public readonly tax: number
    constructor(name: string, position: number, tax: number) {
        super(name, position)
        this.tax = tax
    }

    public toString(): string {
        return `${this.constructor.name}(name=${this.name},tax=${this.tax})`
    }
}

export class FreeParkingTile extends Tile {}

export class JailTile extends Tile {}

export class GoToJailTile extends Tile {}

export class GoTile extends Tile {}