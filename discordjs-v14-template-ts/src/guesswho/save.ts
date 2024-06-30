export class Save {
    private peopleStates = new Set<string>()
 
    toggle(person: string) {
        if (this.peopleStates.has(person)) {
            this.peopleStates.delete(person)
        } else {
            this.peopleStates.add(person)
        }
    }

    isUp(person: string) {
        return !this.peopleStates.has(person)
    }
}