// This file is only used for the GCP deployment
import functions from "@google-cloud/functions-framework";
import {VerifyDiscordRequest} from "./discord.js";
import {handleInteraction} from "./common.js";

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
