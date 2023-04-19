import {config} from "dotenv";
import {installGlobalCommands} from "./discord.js"

config();

const APP_ID = process.env.APP_ID
const TYPE_SLASH_COMMAND = 1
const TYPE_BOOLEAN = 5
const TYPE_STRING = 3

const COMMAND_PING = {
    name: "ping",
    description: "Ping test command",
    type: TYPE_SLASH_COMMAND
}

const COMMAND_POLL = {
    name: "poll",
    description: "Create a new poll for an appointment",
    type: TYPE_SLASH_COMMAND,
    options: [
        {
            type: TYPE_STRING,
            name: "appointments",
            description: 'Dates to vote on. E.g.: "1.5,2.5,6.5", "1.5-6.5,8.5,30.5-4.6"',
            required: true
        },
        {
            type: TYPE_BOOLEAN,
            name: "is_grouped",
            description: "If the given dates should be voted on as groups first or not",
            required: false
        }
    ]
}

const COMMAND_CONTINUE = {
    name: "continue",
    description: "Closes a grouped poll and creates a new poll with the dates in the group",
    type: TYPE_SLASH_COMMAND,
    options: [
        {
            type: TYPE_STRING,
            name: "poll_id",
            description: "The ID of the poll to continue. Only grouped polls can be continued",
            required: true
        }
    ]
}

const COMMAND_CLOSE = {
    name: "close",
    description: "Closes a poll and determines the most voted, earliest date",
    type: TYPE_SLASH_COMMAND,
    options: [
        {
            type: TYPE_STRING,
            name: "poll_id",
            description: "The ID of the poll to close. Only non-grouped polls can be closed",
            required: true
        }
    ]
}

installGlobalCommands(APP_ID, [
    COMMAND_PING, COMMAND_POLL, COMMAND_CONTINUE, COMMAND_CLOSE
])