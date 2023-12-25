import { boardInfo } from './boardInfo'
export class Board {
    public getTileNames(): string[] {
        return boardInfo.tiles.map((tile: any) => tile.id)
    }
}