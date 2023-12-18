import { Contract } from './calculator'

class ScoreKeeper {
    private contracts: Contract[] = []

    public table(): string {
        const header = `Declarer Result Points`
        const results = this.contracts.map(c => c.formatContract()).join('\n')
        const declarers = new Set<string>(this.contracts.map(c => c.declarer).filter(d => d))
        const totalsHeader = "Totals:"
        const totals = Array.from(declarers).map(declarer => 
            `${declarer}: ${this.contracts.filter(c => c.declarer == declarer)
                        .reduce((sum, current) => sum + current.score(), 0)}`
        ).join("\n")
        return `\`\`\`${header}\n${results}\n\n${totalsHeader}\n${totals}\`\`\``
    }

    public addContract(contract: Contract) {
        this.contracts.push(contract)
    }

    public removeLastContract() {
        this.contracts.pop()
    }
}

const scoreKeeper = new ScoreKeeper()
export default scoreKeeper