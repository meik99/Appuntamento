import {v4} from "uuid";
import {InteractionResponseType} from "discord-interactions";
import moment from "moment";

const PollState = {
    Initialized: "initialized",
    WaitForContinue: "waitForContinue",
    WaitForClose: "waitForClose",
    Closed: "closed"
}

class Poll {
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
}

const polls = {}

function formatVotes(options) {
    let result = ""

    for (let i = 0; i < options.length; i++) {
        result += `${options[i]} `
    }
}

export const createPoll = (request, response) => {
    const {data} = request.body;

    if (!data) {
        response.status(400)
        return response.send({})
    }

    const {options} = data

    if (!options) {
        response.status(400)
        return response.send({})
    }

    const optionAppointments = options.find(item => item.name === "appointments")
    const optionIsGrouped = options.find(item => item.name === "is_grouped")

    const appointments = optionAppointments.value
    const isGrouped = optionIsGrouped ? optionIsGrouped.value : false
    const poll = new Poll({
        appointments: appointments,
        isGrouped: isGrouped
    })

    if (isGrouped) {
        poll.state = PollState.WaitForContinue
        poll.options = parseAppointmentGroups(appointments)

        const message = `Poll Id: ${poll.id}
        
        Vote for the timespans that work for you:
        
        ${formatVotes(poll.options)}`
    } else {
        poll.state = PollState.WaitForClose
        poll.options = parseAppointmentGroups(appointments).flatMap(group => parseGroup(group))
    }

    response.status(200)
    return response.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: `received`
        }
    })
}

const parseAppointmentGroups = (appointments) => {
    return appointments.trim().split(",").map(entry => entry.trim())
}

const parseGroup = (group) => {
    if (group.indexOf("-") > -1) {
        const dates = group.split("-")

        if (dates.length !== 2) {
            return []
        }

        return parseMultipleDates(dates)
    }

    return parseSingleDate(group)
}

const prepareDateStrings = (dateStrings) => {
    for (let i = 0; i < dateStrings.length; i++) {
        if (dateStrings[i][dateStrings[i].length - 1] !== ".") {
            dateStrings[i] = dateStrings[i] + "."
        }
    }

    return dateStrings
}

const parseMultipleDates = (dateStrings) => {
    dateStrings = prepareDateStrings(dateStrings)

    const result = []
    const dates = [moment(dateStrings[0], "DD.MM."), moment(dateStrings[1], "DD.MM.")]
    let tmpDate = dates[0]

    while(tmpDate.date() !== dates[1].date() || tmpDate.month() !== dates[1].month()) {
        result.push(tmpDate.toDate())
        tmpDate = moment(tmpDate).add(1, "day")
    }

    result.push(tmpDate.toDate())

    return result
}

const parseSingleDate = (dateString) => {
    dateString = prepareDateStrings([dateString])[0]

    return [moment(dateString, "DD.MM.").toDate()]
}

export const testing = {
    parseAppointmentGroups,
    parseGroup
}