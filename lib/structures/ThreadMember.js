"use strict";

const Base = require("./Base");

class ThreadMember extends Base {
    constructor(data, client) {
        super(data.user_id);
        this.client = client;
        this.threadID = data.thread_id || data.id; // Thanks Discord
    }

    leave() {
        return this.client.leaveThread.call(this.client, this.threadID, this.id);
    }

    toJSON(props = []) {
        return super.toJSON([
            "threadID",
            ...props
        ]);
    }
}

module.exports = ThreadMember;
