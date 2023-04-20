import moment from "moment";
import {Poll, PollState} from "./poll.js";
import {PollResponse} from "./response.js";

const polls = {}

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

    const poll = Poll.fromOptions(options)


    if (poll.isGrouped) {
        poll.state = PollState.WaitForContinue
        poll.options = parseAppointmentGroups(poll.appointments)
        const result = new PollResponse(poll).asInteractionResponse("Vote for the timespans that work for you")

        console.log(JSON.stringify(result))

        polls[poll.id] = poll
        return response.send(result)
    }

    poll.state = PollState.WaitForClose
    poll.options = parseAppointmentGroups(poll.appointments).flatMap(group => parseGroup(group))

    const result = new PollResponse(poll).asInteractionResponse("Vote for the dates that work for you")

    console.log(JSON.stringify(result))

    polls[poll.id] = poll
    return response.send(result)
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
        const date = tmpDate.toDate()

        result.push(`${date.getDate()}.${date.getMonth()}.`)
        tmpDate = moment(tmpDate).add(1, "day")
    }

    const date = tmpDate.toDate()

    result.push(`${date.getDate()}.${date.getMonth()}.`)

    return result
}

const parseSingleDate = (dateString) => {
    dateString = prepareDateStrings([dateString])[0]

    const date = moment(dateString, "DD.MM.").toDate()
    return [`${date.getDate()}.${date.getMonth()}.`]
}

export const testing = {
    parseAppointmentGroups,
    parseGroup
}