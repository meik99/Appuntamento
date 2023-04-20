import {config} from "dotenv";
import express from "express";
import {VerifyDiscordRequest} from "./discord.js";
import {InteractionType, InteractionResponseType} from "discord-interactions";
import {createPoll, updatePoll} from "./poll/command.js";

config()

const PORT = process.env.PORT || 3000
const PUBLIC_KEY = process.env.PUBLIC_KEY

const app = express()

app.use(express.json({verify: VerifyDiscordRequest(PUBLIC_KEY)}))


app.post("/interactions", async (request, response) => {
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

        return commandSwitch(name, request, response)
    } else if (type === InteractionType.MESSAGE_COMPONENT) {
        const {message, token, application_id} = request.body
        const {interaction} = message
        const {user} = interaction

        switch (interaction.name) {
            case "poll":
                return updatePoll(user, data, token, application_id, response)
            default:
                response.set(501)
                return response.send({})
        }
    }

    response.set(400)
    return response.send({})
})

const commandSwitch = (name, request, response) => {
    switch (name) {
        case "ping":
            return pong(response)
        case "poll":
            return createPoll(request, response)
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

app.listen(PORT, () => {
    console.log("Listening on port: ", PORT)
})