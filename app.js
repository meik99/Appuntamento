import {config} from "dotenv";
import express from "express";
import {VerifyDiscordRequest} from "./discord.js";
import {handleInteraction} from "./common.js";

config()

const PORT = process.env.PORT || 3000
const PUBLIC_KEY = process.env.PUBLIC_KEY

const app = express()

app.use(express.json({verify: VerifyDiscordRequest(PUBLIC_KEY)}))


app.post("/interactions", async (request, response) => {
    await handleInteraction(request, response)
})


app.listen(PORT, () => {
    console.log("Listening on port: ", PORT)
})