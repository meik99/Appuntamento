// Exports function common to app.js and index.js
// Not to be used as some sort of utils-file

import {InteractionResponseType, InteractionType} from "discord-interactions";
import {createPoll, updatePoll} from "./poll/command.js";

export const handleInteraction = async (request, response) => {
    const {type, id, data} = request.body

    if (!type) {
        response.status(400)
        return response.send({})
    }

    if (type === InteractionType.PING) {
        response.status(200)
        return response.send({type: InteractionResponseType.PONG})
    }

    if (type === InteractionType.APPLICATION_COMMAND) {
        if (!id || !data) {
            response.status(400)
            return response.send({})
        }

        const {name} = data;

        return await commandSwitch(name, request, response)
    } else if (type === InteractionType.MESSAGE_COMPONENT) {
        const {message, token, application_id, member} = request.body
        const {interaction} = message
        const {user} = member

        console.log(request.body)

        switch (interaction.name) {
            case "poll":
                return await updatePoll(user, data, token, application_id, response)
            default:
                response.set(501)
                return response.send({})
        }
    }

    response.set(400)
    return response.send({})
}


const commandSwitch = async (name, request, response) => {
    switch (name) {
        case "ping":
            return pong(response)
        case "poll":
            return await createPoll(request, response)
        default:
            response.set(501)
            return response.send({})
    }
}

const pong = (response) => {
    return response.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: `pong: ${new Date().toLocaleString()}`
        }
    })
}