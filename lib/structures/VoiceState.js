"use strict";

const Base = require("./Base");

/**
* Represents a member's voice state in a call/guild
* @prop {String?} channelID The ID of the member's current voice channel
*/
class VoiceState extends Base {
    constructor(data) {
        super(data.id);
        this.update(data);
    }

    update(data) {
        if(data.channel_id !== undefined) {
            this.channelID = data.channel_id;
        } else if(this.channelID === undefined) {
            this.channelID = null;
        }
    }

    toJSON(props = []) {
        return super.toJSON([
            "channelID",
            ...props
        ]);
    }
}

module.exports = VoiceState;
