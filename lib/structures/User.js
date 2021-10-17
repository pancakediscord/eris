"use strict";

const Base = require("./Base");
const Endpoints = require("../rest/Endpoints");

/**
* Represents a user
* @prop {String?} avatar The hash of the user's avatar, or null if no avatar
* @prop {String} avatarURL The URL of the user's avatar which can be either a JPG or GIF
* @prop {Boolean} bot Whether the user is an OAuth bot or not
* @prop {Number} createdAt Timestamp of the user's creation
* @prop {String} defaultAvatar The hash for the default avatar of a user if there is no avatar set
* @prop {String} defaultAvatarURL The URL of the user's default avatar
* @prop {String} discriminator The discriminator of the user
* @prop {String} id The ID of the user
* @prop {String} mention A string that mentions the user
* @prop {String} username The username of the user
*/
class User extends Base {
    constructor(data, client) {
        super(data.id);
        if(!client) {
            this._missingClientError = new Error("Missing client in constructor"); // Preserve constructor callstack
        }
        this._client = client;
        this.bot = !!data.bot;
        this.update(data);
    }

    update(data) {
        if(data.avatar !== undefined) {
            this.avatar = data.avatar;
        }
        if(data.username !== undefined) {
            this.username = data.username;
        }
        if(data.discriminator !== undefined) {
            this.discriminator = data.discriminator;
        }
    }

    get avatarURL() {
        if(this._missingClientError) {
            throw this._missingClientError;
        }
        return this.avatar ? this._client._formatImage(Endpoints.USER_AVATAR(this.id, this.avatar)) : this.defaultAvatarURL;
    }

    get defaultAvatar() {
        return this.discriminator % 5;
    }

    get defaultAvatarURL() {
        return `${Endpoints.CDN_URL}${Endpoints.DEFAULT_USER_AVATAR(this.defaultAvatar)}.png`;
    }

    get mention() {
        return `<@${this.id}>`;
    }

    /**
    * Get the user's avatar with the given format and size
    * @arg {String} [format] The filetype of the avatar ("jpg", "jpeg", "png", "gif", or "webp")
    * @arg {Number} [size] The size of the avatar (any power of two between 16 and 4096)
    */
    dynamicAvatarURL(format, size) {
        return this.avatar ? this._client._formatImage(Endpoints.USER_AVATAR(this.id, this.avatar), format, size) : this.defaultAvatarURL;
    }

    /**
    * Get a DM channel with the user, or create one if it does not exist
    * @returns {Promise<PrivateChannel>}
    */
    getDMChannel() {
        return this._client.getDMChannel.call(this._client, this.id);
    }

    toJSON(props = []) {
        return super.toJSON([
            "avatar",
            "bot",
            "discriminator",
            "username",
            ...props
        ]);
    }
}

module.exports = User;
