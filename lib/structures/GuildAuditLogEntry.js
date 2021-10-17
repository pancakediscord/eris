"use strict";

const Base = require("./Base");
const {AuditLogActions} = require("../Constants");

/**
* Represents a guild audit log entry describing a moderation action
* @prop {Number} actionType The action type of the entry. See Constants.AuditLogActions for more details
* @prop {Object?} after The properties of the targeted object after the action was taken
* For example, if a channel was renamed from #general to #potato, this would be `{name: "potato"}``
* @prop {Object?} before The properties of the targeted object before the action was taken
* For example, if a channel was renamed from #general to #potato, this would be `{name: "general"}``
* @prop {(CategoryChannel | TextChannel | VoiceChannel | NewsThreadChannel | PrivateThreadChannel | PublicThreadChannel | StageChannel)?} channel The channel targeted in the entry, action types 26 (MEMBER_MOVE), 72/74/75 (MESSAGE_DELETE/PIN/UNPIN) and 83/84/85 (STAGE_INSTANCE_CREATE/UPDATE/DELETE) only
* @prop {Number?} count The number of entities targeted
* For example, for action type 26 (MEMBER_MOVE), this is the number of members that were moved/disconnected from the voice channel
* @prop {Number?} deleteMemberDays The number of days of inactivity to prune for, action type 21 (MEMBER_PRUNE) only
* @prop {Guild} guild The guild containing the entry
* @prop {String} id The ID of the entry
* @prop {(Member | Object)?} member The member described by the permission overwrite, action types 13-15 (CHANNEL\_OVERWRITE\_CREATE/UPDATE/DELETE) only. If the member is not cached, this could be {id: String}
* @prop {Number?} membersRemoved The number of members pruned from the server, action type 21 (MEMBER_PRUNE) only
* @prop {(Message | Object)?} message The message that was (un)pinned, action types 74/75 (MESSAGE_PIN/UNPIN) only. If the message is not cached, this will be an object with an `id` key. No other property is guaranteed.
* @prop {String?} reason The reason for the action
* @prop {(Role | Object)?} role The role described by the permission overwrite, action types 13-15 (CHANNEL\_OVERWRITE\_CREATE/UPDATE/DELETE) only. If the role is not cached, this could be {id: String, name: String}
* @prop {(CategoryChannel | Guild | Member | Invite | Role | Object | TextChannel | VoiceChannel | NewsChannel)?} target The object of the action target
* If the item is not cached, this property will be null
* If the action targets a guild, this could be a Guild object
* If the action targets a guild channel, this could be a CategoryChannel, TextChannel, or VoiceChannel object
* If the action targets a member, this could be a Member object
* If the action targets a role, this could be a Role object
* If the action targets an invite, this is an Invite object
* If the action targets a webhook, this is null
* If the action targets a emoji, this could be an emoji Object
* If the action targets a message, this is a User object
* @prop {String} targetID The ID of the action target
* @prop {User} user The user that performed the action
*/
class GuildAuditLogEntry extends Base {
    constructor(data, guild) {
        super(data.id);
        this.actionType = data.action_type;
        this.reason = data.reason || null;
        this.user = guild.shard.client.users.get(data.user_id);

        if(data.target_id) {
            this.targetID = data.target_id;
        }
    }

    get target() { // pay more, get less
        if(this.actionType < 10) { // Guild
            return this.guild;
        } else if(this.actionType < 20) { // Channel
            return this.guild && this.guild.channels.get(this.targetID);
        } else if(this.actionType < 30) { // Member
            if(this.actionType === AuditLogActions.MEMBER_MOVE || this.actionType === AuditLogActions.MEMBER_DISCONNECT) { // MEMBER_MOVE / MEMBER_DISCONNECT
                return null;
            }
            return this.guild && this.guild.members.get(this.targetID);
        } else if(this.actionType < 40) { // Role
            return this.guild && this.guild.roles.get(this.targetID);
        } else if(this.actionType < 50) { // Invite
            const changes = this.actionType === 42 ? this.before : this.after; // Apparently the meaning of life is a deleted invite
            return changes;
        } else if(this.actionType < 60) { // Webhook
            return null; // Go get the webhook yourself
        } else if(this.actionType < 70) { // Emoji
            return this.guild && this.guild.emojis.find((emoji) => emoji.id === this.targetID);
        } else if(this.actionType < 80) { // Message
            return this.guild && this.guild.shard.client.users.get(this.targetID);
        } else if(this.actionType < 83) { // Integrations
            return null;
        } else if(this.actionType < 90) { // Stage Instances
            return this.guild && this.guild.threads.get(this.targetID);
        } else {
            throw new Error("Unrecognized action type: " + this.actionType);
        }
    }

    toJSON(props = []) {
        return super.toJSON([
            "actionType",      
            "reason",
            "targetID",
            "user",
            ...props
        ]);
    }
}

module.exports = GuildAuditLogEntry;
