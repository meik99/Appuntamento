import moment from "moment";
import {Poll, PollState} from "./poll.js";
import {PollResponse} from "./response.js";
import {parseAppointmentGroups, parseGroup} from "./date-parser.js";
import {InteractionResponseType} from "discord-interactions";
import {FirebaseRepository} from "./repository/firebase.js";

const repo = new FirebaseRepository()

export const createPoll = async (request, response, repository = repo) => {
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

        await repository.insert(poll)

        return response.send(result)
    }

    poll.state = PollState.WaitForClose
    poll.options = parseAppointmentGroups(poll.appointments).flatMap(group => parseGroup(group))

    const result = new PollResponse(poll).asInteractionResponse("Vote for the dates that work for you")

    console.log(JSON.stringify(result))

    await repository.insert(poll)

    return response.send(result)
}

function formatVotes(poll) {
    return Object.values(poll.votes).map(vote => `* ${vote.username}: ${vote.values.join(", ")}`).join("\n")
}

export const updatePoll = async (user, data, token, applicationId, response, repository = repo) => {
    const poll = await repository.find(data.custom_id)

    poll.votes[user.id] = {values: data.values, username: user.username}

    await repository.update(poll)

    return response.send({
        type: InteractionResponseType.UPDATE_MESSAGE,
        data: {
            content: `Poll Id: ${poll.id}
            
The following people have voted:

${formatVotes(poll)}`,
        }
    })
}