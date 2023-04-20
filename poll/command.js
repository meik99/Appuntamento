import moment from "moment";
import {Poll, PollState} from "./poll.js";
import {PollResponse} from "./response.js";
import {parseAppointmentGroups, parseGroup} from "./date-parser.js";
import {InteractionResponseType} from "discord-interactions";

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

function formatVotes(poll) {
    return Object.values(poll.votes).map(vote => `${vote.username}: ${vote.values.join(", ")}`)
}

export const updatePoll = (user, data, token, applicationId, response) => {
    const poll = polls[data.custom_id]

    poll.votes[user.id] = {values: data.values, username: user.username}

    return response.send({
        type: InteractionResponseType.UPDATE_MESSAGE,
        data: {
            content: `Poll Id: ${poll.id}
            
The following people have voted:

* ${formatVotes(poll)}`,
        }
    })
}