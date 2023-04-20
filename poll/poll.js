import {v4} from "uuid";

export const PollState = {
    Initialized: "initialized",
    WaitForContinue: "waitForContinue",
    WaitForClose: "waitForClose",
    Closed: "closed"
}

export class Poll {
    id = ""
    isGrouped = false
    appointments = ""
    state = PollState.Initialized
    options = []

    constructor(poll) {
        if (poll) {
            Object.assign(this, poll)
        }

        this.id = v4()
    }

    generateSelectOptions = () => {
        return this.options.map(option => {
            return {
                label: option,
                value: option,
            }
        })
    }

    static fromOptions = (options) => {
        const optionAppointments = options.find(item => item.name === "appointments")
        const optionIsGrouped = options.find(item => item.name === "is_grouped")

        const appointments = optionAppointments.value
        const isGrouped = optionIsGrouped ? optionIsGrouped.value : false
        return new Poll({
            appointments: appointments,
            isGrouped: isGrouped
        })
    }
}
