export abstract class Contract {
    abstract score(): Number
}

export class PassedContract extends Contract {
    public score(): Number {
        return 0
    }
}

export enum Level {
    ONE = 1,
    TWO,
    THREE,
    FOUR,
    FIVE,
    SIX,
    SEVEN
}

export enum Strain {
    CLUBS,
    DIAMONDS,
    HEARTS,
    SPADES,
    NOTRUMP,
}

export enum Vulnerability {
    NONVULNERABLE,
    VULNERABLE,
}

export enum DoubledState {
    UNDOUBLED,
    DOUBLED,
    REDOUBLED,
}

export class UnpassedContract extends Contract {

    private level: Level 
    private strain: Strain
    private vulnerability: Vulnerability
    private doubledState: DoubledState

    // Number of odd tricks taken if positive, and number of tricks down if negative
    private tricksMadeOrDown: number 

    constructor(vulnerability: Vulnerability, level: Level, strain: Strain, doubledState: DoubledState, tricksMadeOrDown: number) {
        super()
        this.level = level
        this.strain = strain
        this.vulnerability = vulnerability
        this.doubledState = doubledState
        this.tricksMadeOrDown = tricksMadeOrDown
    }

    private madeContract(): boolean {
        return this.tricksMadeOrDown > 0
    }

    private pointsPerContractTrick(firstTrick=false): number {
        const undoubledPoints = (() => {
            switch (this.strain) {
                case Strain.CLUBS: {
                    return 20
                } case Strain.DIAMONDS: {
                    return 20
                } case Strain.HEARTS: {
                    return 30
                } case Strain.SPADES: {
                    return 30
                } case Strain.NOTRUMP: {
                    return firstTrick ? 40 : 30
                }
            }})()
        switch (this.doubledState) {
            case DoubledState.UNDOUBLED: {
                return undoubledPoints
            }
            case DoubledState.DOUBLED: {
                return undoubledPoints * 2
            }
            case DoubledState.REDOUBLED: {
                return undoubledPoints * 4
            }
        }
    }

    private contractTrickPoints(): number {
        return this.pointsPerContractTrick(/* firstTrick= */ true)
                + (this.level - 1) * this.pointsPerContractTrick()
    }

    private pointsPerOvertrick(): number {
        switch (this.doubledState) {
            case DoubledState.UNDOUBLED: {
                return this.pointsPerContractTrick()
            }
            case DoubledState.DOUBLED: {
                return 100
            }
            case DoubledState.REDOUBLED: {
                return 200
            }
        }
    }

    private overtrickPoints(): number {
        return (this.tricksMadeOrDown - this.level) * this.pointsPerOvertrick()
    }

    private slamBonus(): number {
        if (this.level == Level.SIX) {
            switch (this.vulnerability) {
                case Vulnerability.NONVULNERABLE: {
                    return 500
                }
                case Vulnerability.VULNERABLE: {
                    return 750
                }
            }
        }
        if (this.level == Level.SEVEN) {
            switch (this.vulnerability) {
                case Vulnerability.NONVULNERABLE: {
                    return 1000
                }
                case Vulnerability.VULNERABLE: {
                    return 1500
                }
            }
        }
        return 0
    }

    private insultBonus(): number {
        switch (this.doubledState) {
            case DoubledState.UNDOUBLED: {
                return 0
            }
            case DoubledState.DOUBLED: {
                return 50
            }
            case DoubledState.REDOUBLED: {
                return 100
            }
        }
    }

    private duplicateBonus(): number {
        if (this.contractTrickPoints() >= 100) {
            switch (this.vulnerability) {
                case Vulnerability.NONVULNERABLE: {
                    return 300
                }
                case Vulnerability.VULNERABLE: {
                    return 500
                }
            }
        } else {
            return 50
        }
    }

    private undertrickPoints(): number {
        const pointsForFirstUndertrickUndoubled = (() => {
            switch (this.vulnerability) {
                case Vulnerability.NONVULNERABLE: {
                    return 50
                }
                case Vulnerability.VULNERABLE: {
                    return 100
                }
            }
        })()

        const pointsForFirstUndertrick = (() => {
            switch (this.doubledState) {
                case DoubledState.UNDOUBLED: {
                    return pointsForFirstUndertrickUndoubled
                }
                case DoubledState.DOUBLED: {
                    return pointsForFirstUndertrickUndoubled * 2
                }
                case DoubledState.REDOUBLED: {
                    return pointsForFirstUndertrickUndoubled * 4
                }
            }
        })()

        const pointsForSecondOrThirdUndertrick = (() => {
            switch (this.doubledState) {
                case DoubledState.UNDOUBLED: {
                    switch (this.vulnerability) {
                        case Vulnerability.NONVULNERABLE: {
                            return 50
                        }
                        case Vulnerability.VULNERABLE: { 
                            return 100
                        }
                    }
                }
                case DoubledState.DOUBLED: {
                    switch (this.vulnerability) {
                        case Vulnerability.NONVULNERABLE: {
                            return 200
                        }
                        case Vulnerability.VULNERABLE: { 
                            return 300
                        }
                    }
                }
                case DoubledState.REDOUBLED: {
                    switch (this.vulnerability) {
                        case Vulnerability.NONVULNERABLE: {
                            return 400 
                        }
                        case Vulnerability.VULNERABLE: { 
                            return 600 
                        }
                    }
                }
            }
        })()

        const pointsForFourthAndSubsequentUndertrick = (() => {
            switch (this.doubledState) {
                case DoubledState.UNDOUBLED: {
                    switch (this.vulnerability) {
                        case Vulnerability.NONVULNERABLE: {
                            return 50
                        }
                        case Vulnerability.VULNERABLE: { 
                            return 100
                        }
                    }
                }
                case DoubledState.DOUBLED: {
                    return 300
                }
                case DoubledState.REDOUBLED: {
                    return 600
                }
            }
        })()
 
        const undertricks = -this.tricksMadeOrDown
        return pointsForFirstUndertrick
                + (() => {
                    if (undertricks == 1) {
                        return 0
                    }
                    if (undertricks == 2) {
                        return pointsForSecondOrThirdUndertrick
                    } else {
                        return pointsForSecondOrThirdUndertrick * 2
                    }
                })()
                + (() => {
                    if (undertricks < 4) {
                        return 0
                    } else {
                        return (undertricks - 3) * pointsForFourthAndSubsequentUndertrick
                    }
                })()
    }

    public score(): number {
        if (!this.madeContract()) {
            return -this.undertrickPoints()
        } else {
            return this.contractTrickPoints()
                + this.overtrickPoints()
                + this.slamBonus()
                + this.insultBonus()
                + this.duplicateBonus()
        }
    }
}

export function createUnpassedContractUnchecked(level: number, strain: string, tricksMadeOrDown: number, doubledState: string | undefined, vulnerability: string | undefined) {
    const v: Vulnerability = vulnerability == "v" ? Vulnerability.VULNERABLE : Vulnerability.NONVULNERABLE
    const l: Level = level
    const s: Strain = (() => {
        switch (strain) {
            case "c": {
                return Strain.CLUBS
            }
            case "d": {
                return Strain.DIAMONDS
            }
            case "h": {
                return Strain.HEARTS
            }
            case "s": {
                return Strain.SPADES
            }
            case "n": {
                return Strain.NOTRUMP
            }
            default: {
                throw new Error(`Invalid strain: ${strain}`)
            }
        }
    })()
    const d: DoubledState = (() => {
        switch (doubledState) {
            case undefined: {
                return DoubledState.UNDOUBLED
            }
            case "u": {
                return DoubledState.UNDOUBLED
            }
            case "d": {
                return DoubledState.DOUBLED
            }
            case "r": {
                return DoubledState.REDOUBLED
            }
            default: {
                throw new Error(`Invalid doubled state: ${doubledState}`)
            }
        }
    })()
    return new UnpassedContract(v, l, s, d, tricksMadeOrDown)
}

/**
 * Returns reason why input is not suitable for createUnpassedContractUnchecked,
 * "" if the input is valid.
 */
export function validateInput(level: number, strain: string, tricksMadeOrDown: number, doubledState: string | undefined, vulnerability: string | undefined): string {
    if (![1, 2, 3, 4, 5, 6, 7].includes(level)) {
        return `Invalid level: ${level}. Must be one of 1, 2, 3, 4, 5, 6, or 7.`
    }
    if (!["c", "d", "h", "s", "n"].includes(strain)) {
        return `Invalid strain: ${strain}. Must be one of c, d, h, s, or n.`
    }
    if (tricksMadeOrDown < -13) {
        return `Invalid tricks: ${tricksMadeOrDown}. Cannot be less than -13.`
    }
    if (tricksMadeOrDown >= 0 && tricksMadeOrDown < level) {
        return `Invalid tricks: ${tricksMadeOrDown}. Cannot be less than the contract level.`
    }
    if (tricksMadeOrDown > 7) {
        return `Invalid tricks: ${tricksMadeOrDown}. Cannot be greater than 7.`
    }
    if (doubledState !== undefined && !["u", "d", "r"].includes(doubledState)) {
        return `Invalid doubled: ${doubledState}. Must be one of u, d, or r.`
    }
    if (vulnerability !== undefined && !["n", "v", "u"].includes(vulnerability)) {
        return `Invalid vulnerability ${vulnerability}. Must be one of n, v, or u.`
    }
    return ""
}