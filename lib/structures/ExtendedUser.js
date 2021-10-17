"use strict";

const User = require("./User");

/**
* Represents an extended user
* @extends User
* @prop {String} email The email of the user
* @prop {Boolean} mfaEnabled Whether the user has enabled two-factor authentication
* @prop {Number} premiumType The type of Nitro subscription on the user's account
* @prop {Boolean} verified Whether the account email has been verified
*/
class ExtendedUser extends User {
    constructor(data, client) {
        super(data, client);
        this.update(data);
    }

    update(data) {
        super.update(data);
    }

    toJSON(props = []) {
        return super.toJSON([
            ...props
        ]);
    }
}

module.exports = ExtendedUser;
