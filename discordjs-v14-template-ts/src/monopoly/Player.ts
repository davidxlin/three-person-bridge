import { PropertyTile } from './Tile'
export class Player {
    readonly name: string
    position: string = "Go"
    money: number = 1500
    readonly properties: PropertyTile[] = []
    numGetOutOfJailFreeCards: number = 0

    constructor(name: string) {
        this.name= name
    }

    public toString(): string {
        return `Player(name=${this.name},position=${this.position},money=${this.money},numGetOutOfJailFreeCards=${this.numGetOutOfJailFreeCards}),properties=${this.properties})`
    }
}