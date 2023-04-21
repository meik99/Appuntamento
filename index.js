// This file is only used for the GCP deployment
const functions = require('@google-cloud/functions-framework');
const {VerifyDiscordRequest} = require("./discord.js");
const {handleInteraction} = require("./common.js");

const PUBLIC_KEY = process.env.PUBLIC_KEY

functions.http('interactions', async (req, res, buf, encoding) => {
    try {
        VerifyDiscordRequest(PUBLIC_KEY)(req, res, buf, encoding)
    } catch (e) {
        console.error(e)
        return
    }

    await handleInteraction(req, res)
});
