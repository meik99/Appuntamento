import {InteractionResponseType} from "discord-interactions";
import {Poll} from "./poll.js";

const TYPE_STRING = 3
const TYPE_ACTION_ROW = 1

export class PollResponse {
    poll = new Poll()

    constructor(poll) {
        this.poll = poll
    }

    asInteractionResponse = (placeholder) => {
        if (this.poll.options.length > 25) {
            return {
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: `This poll cannot be created since the amount of options is too high.
                    
There are ${this.poll.options.length} options, but the maximum that is technically possible is 25.
`
                }
            }
        }

        return {
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: `Poll Id: ${this.poll.id}`,
                components: [
                    {
                        type: TYPE_ACTION_ROW,
                        components: [
                            {
                                type: TYPE_STRING,
                                custom_id: this.poll.id,
                                options: this.poll.generateSelectOptions(),
                                min_values: 0,
                                max_values: this.poll.options.length,
                                placeholder: placeholder || ""
                            }
                        ]
                    }
                ]
            }
        }
    }
}