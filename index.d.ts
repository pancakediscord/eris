import { EventEmitter } from "events";
import { Duplex, Readable as ReadableStream, Stream } from "stream";
import { Agent as HTTPSAgent } from "https";
import { IncomingMessage, ClientRequest } from "http";
import OpusScript = require("opusscript"); // Thanks TypeScript
import { URL } from "url";
import { Socket as DgramSocket } from "dgram";
import * as WebSocket from "ws";

declare function Eris(token: string, options: Eris.ClientOptions): Eris.Client;

declare namespace Eris {
  export const Constants: Constants;
  export const VERSION: string;

  // TYPES
  // Cache
  type Uncached = { id: string };

  // Channel
  type AnyChannel = AnyGuildChannel | PrivateChannel;
  type AnyGuildChannel = GuildTextableChannel | AnyVoiceChannel | CategoryChannel | StoreChannel;
  type AnyThreadChannel = NewsThreadChannel | PrivateThreadChannel | PublicThreadChannel | ThreadChannel;
  type AnyVoiceChannel = VoiceChannel | StageChannel;
  type ChannelTypes = Constants["ChannelTypes"][keyof Constants["ChannelTypes"]];
  type GuildTextableChannel = TextChannel | NewsChannel;
  type GuildTextableWithThread = GuildTextableChannel | AnyThreadChannel;
  type InviteChannel = InvitePartialChannel | Exclude<AnyGuildChannel, CategoryChannel | AnyThreadChannel>;
  type PossiblyUncachedTextable = Textable | Uncached;
  type PossiblyUncachedTextableChannel = TextableChannel | Uncached;
  type TextableChannel = (GuildTextable & GuildTextableChannel) | (ThreadTextable & AnyThreadChannel) | (Textable & PrivateChannel);
  type VideoQualityMode = 1 | 2;

  // Command
  type CommandGenerator = CommandGeneratorFunction | MessageContent | MessageContent[] | CommandGeneratorFunction[];
  type CommandGeneratorFunction = (msg: Message, args: string[]) => GeneratorFunctionReturn;
  type GeneratorFunctionReturn = Promise<MessageContent> | Promise<void> | MessageContent | void;
  type GenericCheckFunction<T> = (msg: Message) => T | Promise<T>;
  type ReactionButtonsFilterFunction = (msg: Message, emoji: Emoji, userID: string) => boolean;
  type ReactionButtonsGenerator = ReactionButtonsGeneratorFunction | MessageContent | MessageContent[] | ReactionButtonsGeneratorFunction[];
  type ReactionButtonsGeneratorFunction = (msg: Message, args: string[], userID: string) => GeneratorFunctionReturn;

  // Gateway/REST
  type IntentStrings = keyof Constants["Intents"];
  type ReconnectDelayFunction = (lastDelay: number, attempts: number) => number;
  type RequestMethod = "GET" | "PATCH" | "DELETE" | "POST" | "PUT";

  // Guild
  type DefaultNotifications = 0 | 1;
  type ExplicitContentFilter = 0 | 1 | 2;
  type GuildFeatures = "ANIMATED_ICON" | "BANNER" | "COMMERCE" | "COMMUNITY" | "DISCOVERABLE" | "FEATURABLE" | "INVITE_SPLASH" | "MEMBER_VERIFICATION_GATE_ENABLED" | "NEWS" | "PARTNERED" | "PREVIEW_ENABLED" | "VANITY_URL" | "VERIFIED" | "VIP_REGIONS" | "WELCOME_SCREEN_ENABLED" | "TICKETED_EVENTS_ENABLED" | "MONETIZATION_ENABLED" | "MORE_STICKERS" | "THREE_DAY_THREAD_ARCHIVE" | "SEVEN_DAY_THREAD_ARCHIVE" | "PRIVATE_THREADS";
  type NSFWLevel = 0 | 1 | 2 | 3;
  type PossiblyUncachedGuild = Guild | Uncached;
  type PremiumTier = 0 | 1 | 2 | 3;
  type VerificationLevel = 0 | 1 | 2 | 3 | 4;

  // Message
  type ActionRowComponents = Button | SelectMenu;
  type Button = InteractionButton | URLButton;
  type Component = ActionRow | ActionRowComponents;
  type ImageFormat = "jpg" | "jpeg" | "png" | "gif" | "webp";
  type MessageContent = string | AdvancedMessageContent;
  type MessageContentEdit = string | AdvancedMessageContentEdit;
  type MFALevel = 0 | 1;
  type PossiblyUncachedMessage = Message | { channel: TextableChannel | { id: string; guild?: Uncached }; guildID?: string; id: string };
  type InteractionType = 1 | 2;

  // Permission
  type PermissionType = 0 | 1;

  // Presence/Relationship
  type ActivityType = BotActivityType | 4;
  type BotActivityType = 0 | 1 | 2 | 3 | 5;
  type FriendSuggestionReasons = { name: string; platform_type: string; type: number }[];
  type Status = "online" | "idle" | "dnd" | "offline";

  // Thread
  type AutoArchiveDuration = 60 | 1440 | 4320 | 10080;

  // Voice
  type ConverterCommand = "./ffmpeg" | "./avconv" | "ffmpeg" | "avconv";
  type StageInstancePrivacyLevel = 1 | 2;

  // Webhook
  type MessageWebhookContent = Pick<WebhookPayload, "content" | "embeds" | "file" | "allowedMentions" | "components">;

  // INTERFACES
  // Internals
  interface JSONCache {
    [s: string]: unknown;
  }
  interface NestedJSON {
    toJSON(arg?: unknown, cache?: (string | unknown)[]): JSONCache;
  }
  interface SimpleJSON {
    toJSON(props?: string[]): JSONCache;
  }

  // Channel
  interface ChannelFollow {
    channel_id: string;
    webhook_id: string;
  }
  interface CreateChannelInviteOptions {
    maxAge?: number;
    maxUses?: number;
    temporary?: boolean;
    unique?: boolean;
  }
  interface CreateChannelOptions {
    bitrate?: number;
    nsfw?: boolean;
    parentID?: string;
    permissionOverwrites?: Overwrite[];
    rateLimitPerUser?: number;
    reason?: string;
    topic?: string;
    userLimit?: number;
  }
  interface EditChannelOptions extends Omit<CreateChannelOptions, "permissionOverwrites" | "reason"> {
    archived?: boolean;
    autoArchiveDuration?: AutoArchiveDuration;
    defaultAutoArchiveDuration?: AutoArchiveDuration;
    icon?: string;
    invitable?: boolean;
    locked?: boolean;
    name?: string;
    ownerID?: string;
    rtcRegion?: string | null;
    videoQualityMode?: VideoQualityMode;
  }
  interface EditChannelPositionOptions {
    lockPermissions?: string;
    parentID?: string;
  }
  interface GetMessagesOptions {
    after?: string;
    around?: string;
    before?: string;
    limit?: number;
  }
  interface GuildTextable extends Textable {
    lastPinTimestamp: number | null;
    rateLimitPerUser: number;
    topic: string | null;
    createWebhook(options: { name: string; avatar?: string | null }, reason?: string): Promise<Webhook>;
    deleteMessages(messageIDs: string[], reason?: string): Promise<void>;
    getWebhooks(): Promise<Webhook[]>;
    purge(options: PurgeChannelOptions): Promise<number>;
    removeMessageReactionEmoji(messageID: string, reaction: string): Promise<void>;
    removeMessageReactions(messageID: string): Promise<void>;
    sendTyping(): Promise<void>;
  }
  interface PartialChannel {
    bitrate?: number;
    id: string;
    name?: string;
    nsfw?: boolean;
    parent_id?: number;
    permission_overwrites?: Overwrite[];
    rate_limit_per_user?: number;
    topic?: string;
    type: number;
    user_limit?: number;
  }
  interface PurgeChannelOptions {
    after?: string;
    before?: string;
    filter?: (m: Message<GuildTextableChannel>) => boolean;
    limit: number;
    reason?: string;
  }
  interface Textable {
    lastMessageID: string;
    messages: Collection<Message<this>>;
    addMessageReaction(messageID: string, reaction: string): Promise<void>;
    /** @deprecated */
    addMessageReaction(messageID: string, reaction: string, userID: string): Promise<void>;
    createMessage(content: MessageContent, file?: MessageFile | MessageFile[]): Promise<Message>;
    deleteMessage(messageID: string, reason?: string): Promise<void>;
    editMessage(messageID: string, content: MessageContentEdit): Promise<Message>;
    getMessage(messageID: string): Promise<Message>;
    getMessageReaction(messageID: string, reaction: string, options?: GetMessageReactionOptions): Promise<User[]>;
    /** @deprecated */
    getMessageReaction(messageID: string, reaction: string, limit?: number, before?: string, after?: string): Promise<User[]>;
    getMessages(options?: GetMessagesOptions): Promise<Message[]>;
    /** @deprecated */
    getMessages(limit?: number, before?: string, after?: string, around?: string): Promise<Message[]>;
    getPins(): Promise<Message[]>;
    pinMessage(messageID: string): Promise<void>;
    removeMessageReaction(messageID: string, reaction: string, userID?: string): Promise<void>;
    sendTyping(): Promise<void>;
    unpinMessage(messageID: string): Promise<void>;
    unsendMessage(messageID: string): Promise<void>;
  }
  // @ts-ignore ts(2430) - ThreadTextable can't properly extend Textable because of getMessageReaction deprecated overload
  interface ThreadTextable extends Textable {
    lastPinTimestamp?: number;
    createMessage(content: MessageContent, file?: MessageFile | MessageFile[]): Promise<Message<ThreadChannel>>;
    editMessage(messageID: string, content: MessageContentEdit): Promise<Message<ThreadChannel>>;
    getMessage(messageID: string): Promise<Message<ThreadChannel>>;
    getMessageReaction(messageID: string, reaction: string, options?: GetMessageReactionOptions): Promise<User[]>;
    getMessages(options?: GetMessagesOptions): Promise<Message<ThreadChannel>[]>;
    getPins(): Promise<Message<ThreadChannel>[]>;
  }
  interface WebhookData {
    channelID: string;
    guildID: string;
  }

  // Client
  interface ClientOptions {
    /** @deprecated */
    agent?: HTTPSAgent;
    allowedMentions?: AllowedMentions;
    autoreconnect?: boolean;
    compress?: boolean;
    connectionTimeout?: number;
    defaultImageFormat?: string;
    defaultImageSize?: number;
    disableEvents?: { [s: string]: boolean };
    firstShardID?: number;
    getAllUsers?: boolean;
    guildCreateTimeout?: number;
    intents: number | IntentStrings[];
    largeThreshold?: number;
    lastShardID?: number;
    /** @deprecated */
    latencyThreshold?: number;
    maxReconnectAttempts?: number;
    maxResumeAttempts?: number;
    maxShards?: number | "auto";
    messageLimit?: number;
    opusOnly?: boolean;
    /** @deprecated */
    ratelimiterOffset?: number;
    reconnectDelay?: ReconnectDelayFunction;
    requestTimeout?: number;
    rest?: RequestHandlerOptions;
    restMode?: boolean;
    seedVoiceConnections?: boolean;
    ws?: unknown;
  }
  interface CommandClientOptions {
    argsSplitter?: (str: string) => string[];
    defaultCommandOptions?: CommandOptions;
    defaultHelpCommand?: boolean;
    description?: string;
    ignoreBots?: boolean;
    ignoreSelf?: boolean;
    name?: string;
    owner?: string;
    prefix?: string | string[];
  }
  interface RequestHandlerOptions {
    agent?: HTTPSAgent;
    baseURL?: string;
    decodeReasons?: boolean;
    disableLatencyCompensation?: boolean;
    domain?: string;
    latencyThreshold?: number;
    ratelimiterOffset?: number;
    requestTimeout?: number;
  }

  // Command
  interface CommandCooldownExclusions {
    channelIDs?: string[];
    guildIDs?: string[];
    userIDs?: string[];
  }
  interface CommandOptions {
    aliases?: string[];
    argsRequired?: boolean;
    caseInsensitive?: boolean;
    cooldown?: number;
    cooldownExclusions?: CommandCooldownExclusions;
    cooldownMessage?: MessageContent | GenericCheckFunction<MessageContent> | false;
    cooldownReturns?: number;
    defaultSubcommandOptions?: CommandOptions;
    deleteCommand?: boolean;
    description?: string;
    dmOnly?: boolean;
    errorMessage?: MessageContent | GenericCheckFunction<MessageContent>;
    fullDescription?: string;
    guildOnly?: boolean;
    hidden?: boolean;
    hooks?: Hooks;
    invalidUsageMessage?: MessageContent | GenericCheckFunction<MessageContent> | false;
    permissionMessage?: MessageContent | GenericCheckFunction<MessageContent> | false;
    reactionButtons?: CommandReactionButtonsOptions[] | null;
    reactionButtonTimeout?: number;
    requirements?: CommandRequirements;
    restartCooldown?: boolean;
    usage?: string;
  }
  interface CommandReactionButtons extends CommandReactionButtonsOptions {
    execute: (msg: Message, args: string[], userID: string) => string | GeneratorFunctionReturn;
    responses: ((() => string) | ReactionButtonsGeneratorFunction)[];
  }
  interface CommandReactionButtonsOptions {
    emoji: string;
    filter: ReactionButtonsFilterFunction;
    response: string | ReactionButtonsGeneratorFunction;
    type: "edit" | "cancel";
  }
  interface CommandRequirements {
    custom?: GenericCheckFunction<boolean>;
    permissions?: { [s: string]: boolean } | GenericCheckFunction<{ [s: string]: boolean }>;
    roleIDs?: string[] | GenericCheckFunction<string[]>;
    roleNames?: string[] | GenericCheckFunction<string[]>;
    userIDs?: string[] | GenericCheckFunction<string[]>;
  }
  interface Hooks {
    postCheck?: (msg: Message, args: string[], checksPassed: boolean) => void;
    postCommand?: (msg: Message, args: string[], sent?: Message) => void;
    postExecution?: (msg: Message, args: string[], executionSuccess: boolean) => void;
    preCommand?: (msg: Message, args: string[]) => void;
  }

  // Embed
  // Omit<T, K> used to override
  interface Embed extends Omit<EmbedOptions, "footer" | "image" | "thumbnail" | "author"> {
    author?: EmbedAuthor;
    footer?: EmbedFooter;
    image?: EmbedImage;
    provider?: EmbedProvider;
    thumbnail?: EmbedImage;
    type: string;
    video?: EmbedVideo;
  }
  interface EmbedAuthor extends EmbedAuthorOptions {
    proxy_icon_url?: string;
  }
  interface EmbedAuthorOptions {
    icon_url?: string;
    name: string;
    url?: string;
  }
  interface EmbedField {
    inline?: boolean;
    name: string;
    value: string;
  }
  interface EmbedFooter extends EmbedFooterOptions {
    proxy_icon_url?: string;
  }
  interface EmbedFooterOptions {
    icon_url?: string;
    text: string;
  }
  interface EmbedImage extends EmbedImageOptions {
    height?: number;
    proxy_url?: string;
    width?: number;
  }
  interface EmbedImageOptions {
    url?: string;
  }
  interface EmbedOptions {
    author?: EmbedAuthorOptions;
    color?: number;
    description?: string;
    fields?: EmbedField[];
    footer?: EmbedFooterOptions;
    image?: EmbedImageOptions;
    thumbnail?: EmbedImageOptions;
    timestamp?: Date | string;
    title?: string;
    url?: string;
  }
  interface EmbedProvider {
    name?: string;
    url?: string;
  }
  interface EmbedVideo {
    height?: number;
    url?: string;
    width?: number;
  }

  // Emoji
  interface Emoji extends EmojiBase {
    animated: boolean;
    available: boolean;
    id: string;
    managed: boolean;
    require_colons: boolean;
    roles: string[];
    user?: PartialUser;
  }
  interface EmojiBase {
    icon?: string;
    name: string;
  }
  interface EmojiOptions extends Exclude<EmojiBase, "icon"> {
    image: string;
    roles?: string[];
  }
  interface PartialEmoji {
    id: string | null;
    name: string;
    animated?: boolean;
  }

  // Events
  interface OldGuild {
    afkChannelID: string | null;
    afkTimeout: number;
    banner: string | null;
    defaultNotifications: DefaultNotifications;
    description: string | null;
    discoverySplash: string | null;
    emojis: Omit<Emoji, "user" | "icon">[];
    explicitContentFilter: ExplicitContentFilter;
    features: GuildFeatures[];
    icon: string | null;
    large: boolean;
    maxMembers?: number;
    maxVideoChannelUsers?: number;
    mfaLevel: MFALevel;
    name: string;
    /** @deprecated */
    nsfw: boolean;
    nsfwLevel: NSFWLevel;
    ownerID: string;
    preferredLocale?: string;
    premiumSubscriptionCount?: number;
    premiumTier: PremiumTier;
    publicUpdatesChannelID: string | null;
    rulesChannelID: string | null;
    splash: string | null;
    systemChannelFlags: number;
    systemChannelID: string | null;
    vanityURL: string | null;
    verificationLevel: VerificationLevel;
  }
  interface OldGuildChannel {
    bitrate?: number;
    name: string;
    nsfw?: boolean;
    parentID: string | null;
    permissionOverwrites: Collection<PermissionOverwrite>;
    position: number;
    rateLimitPerUser?: number;
    rtcRegion?: string | null;
    topic?: string | null;
    type: Exclude<ChannelTypes, 1 | 3>;
  }
  interface OldGuildTextChannel extends OldGuildChannel {
    nsfw: boolean;
    rateLimitPerUser: number;
    topic: string | null;
    type: 0 | 5;
  }
  interface OldGuildVoiceChannel extends OldGuildChannel {
    bitrate: number;
    rtcRegion: string | null;
    type: 2 | 13;
    userLimit: number;
    videoQualityMode: VideoQualityMode;
  }
  interface OldMember {
    avatar: string | null;
    nick: string | null;
    pending?: boolean;
    premiumSince: number;
    roles: string[];
  }
  interface OldMessage {
    attachments: Attachment[];
    channelMentions: string[];
    content: string;
    editedTimestamp?: number;
    embeds: Embed[];
    flags: number;
    mentionedBy?: unknown;
    mentions: string[];
    pinned: boolean;
    roleMentions: string[];
    tts: boolean;
  }
  interface OldRole {
    color: number;
    hoist: boolean;
    managed: boolean;
    mentionable: boolean;
    name: string;
    permissions: Permission;
    position: number;
  }
  interface OldStageInstance {
    discoverableDisabled: boolean;
    privacyLevel: StageInstancePrivacyLevel;
    topic: string;
  }
  interface OldThread {
    name: string;
    rateLimitPerUser: number;
    threadMetadata: ThreadMetadata;
  }
  interface OldThreadMember {
    flags: number;
  }
  interface OldVoiceState {
    deaf: boolean;
    mute: boolean;
    selfDeaf: boolean;
    selfMute: boolean;
    selfStream: boolean;
    selfVideo: boolean;
  }
  interface EventListeners {
    channelCreate: [channel: AnyChannel];
    channelDelete: [channel: AnyChannel];
    channelPinUpdate: [channel: TextableChannel, timestamp: number, oldTimestamp: number];
    channelUpdate: [channel: AnyGuildChannel, oldChannel: OldGuildChannel | OldGuildTextChannel | OldGuildVoiceChannel] 
    connect: [id: number];
    debug: [message: string, id: number];
    disconnect: [];
    error: [err: Error, id: number];
    friendSuggestionCreate: [user: User, reasons: FriendSuggestionReasons];
    friendSuggestionDelete: [user: User];
    guildAvailable: [guild: Guild];
    guildBanAdd: [guild: Guild, user: User];
    guildBanRemove: [guild: Guild, user: User];
    guildCreate: [guild: Guild];
    guildDelete: [guild: PossiblyUncachedGuild];
    guildEmojisUpdate: [guild: PossiblyUncachedGuild, emojis: Emoji[], oldEmojis: Emoji[] | null];
    guildMemberAdd: [guild: Guild, member: Member];
    guildMemberChunk: [guild: Guild, member: Member[]];
    guildMemberRemove: [guild: Guild, member: Member | MemberPartial];
    guildMemberUpdate: [guild: Guild, member: Member, oldMember: OldMember | null];
    guildRoleCreate: [guild: Guild, role: Role];
    guildRoleDelete: [guild: Guild, role: Role];
    guildRoleUpdate: [guild: Guild, role: Role, oldRole: OldRole];
    guildUnavailable: [guild: UnavailableGuild];
    guildUpdate: [guild: Guild, oldGuild: OldGuild];
    hello: [trace: string[], id: number];
    messageCreate: [message: Message<PossiblyUncachedTextableChannel>];
    messageDelete: [message: PossiblyUncachedMessage];
    messageDeleteBulk: [messages: PossiblyUncachedMessage[]];
    messageReactionAdd: [message: PossiblyUncachedMessage, emoji: PartialEmoji, reactor: Member | Uncached];
    messageReactionRemove: [message: PossiblyUncachedMessage, emoji: PartialEmoji, userID: string];
    messageReactionRemoveAll: [message: PossiblyUncachedMessage];
    messageReactionRemoveEmoji: [message: PossiblyUncachedMessage, emoji: PartialEmoji];
    messageUpdate: [message: Message<PossiblyUncachedTextableChannel>, oldMessage: OldMessage | null];
    rawREST: [request: RawRESTRequest];
    rawWS: [packet: RawPacket, id: number];
    ready: [];
    stageInstanceCreate: [stageInstance: StageInstance];
    stageInstanceDelete: [stageInstance: StageInstance];
    stageInstanceUpdate: [stageInstance: StageInstance, oldStageInstance: OldStageInstance | null];
    threadCreate: [channel: AnyThreadChannel];
    threadDelete: [channel: AnyThreadChannel];
    threadListSync: [guild: Guild, deletedThreads: (AnyThreadChannel | Uncached)[], activeThreads: AnyThreadChannel[], joinedThreadsMember: ThreadMember[]];
    threadMembersUpdate: [channel: AnyThreadChannel, addedMembers: ThreadMember[], removedMembers: (ThreadMember | Uncached)[]];
    threadMemberUpdate: [channel: AnyThreadChannel, member: ThreadMember, oldMember: OldThreadMember];
    threadUpdate: [channel: AnyThreadChannel, oldChannel: OldThread | null];
    typingStart: [channel: GuildTextableChannel | Uncached, user: User | Uncached, member: Member] 
      | [channel: PrivateChannel | Uncached, user: User | Uncached, member: null];
    unavailableGuildCreate: [guild: UnavailableGuild];
    unknown: [packet: RawPacket, id: number];
    userUpdate: [user: User, oldUser: PartialUser | null];
    voiceChannelJoin: [member: Member, channel: AnyVoiceChannel];
    voiceChannelLeave: [member: Member, channel: AnyVoiceChannel];
    voiceChannelSwitch: [member: Member, newChannel: AnyVoiceChannel, oldChannel: AnyVoiceChannel];
    voiceStateUpdate: [member: Member, oldState: OldVoiceState];
    warn: [message: string, id: number];
    webhooksUpdate: [data: WebhookData];    
  }
  interface ClientEvents extends EventListeners {
    shardDisconnect: [err: Error | undefined, id: number];
    shardReady: [id: number];
    shardResume: [id: number];
  }
  interface ShardEvents extends EventListeners {
    resume: [];
  }
  interface StreamEvents {
    end: [];
    error: [err: Error];
    start: [];
  }
  interface VoiceEvents {
    connect: [];
    debug: [message: string];
    disconnect: [err?: Error];
    end: [];
    error: [err: Error];
    ping: [latency: number];
    ready: [];
    speakingStart: [userID: string];
    speakingStop: [userID: string];
    start: [];
    unknown: [packet: RawPacket];
    userDisconnect: [userID: string];
    warn: [message: string];
  }

  // Gateway/REST
  interface HTTPResponse {
    code: number;
    message: string;
  }
  interface LatencyRef {
    lastTimeOffsetCheck: number;
    latency: number;
    raw: number[];
    timeOffset: number;
    timeOffsets: number[];
  }
  interface RawPacket {
    d?: unknown;
    op: number;
    s?: number;
    t?: string;
  }
  interface RawRESTRequest {
    auth: boolean;
    body?: unknown;
    file?: MessageFile;
    method: string;
    resp: IncomingMessage;
    route: string;
    short: boolean;
    url: string;
  }
  interface RequestMembersPromise {
    members: Member;
    received: number;
    res: (value: Member[]) => void;
    timeout: NodeJS.Timeout;
  }

  // Guild
  interface CreateGuildOptions {
    afkChannelID?: string;
    afkTimeout?: number;
    channels?: PartialChannel[];
    defaultNotifications?: DefaultNotifications;
    explicitContentFilter?: ExplicitContentFilter;
    icon?: string;
    roles?: PartialRole[];
    systemChannelID: string;
    verificationLevel?: VerificationLevel;
  }
  interface DiscoveryCategory {
    id: number;
    is_primary: boolean;
    name: {
      default: string;
      localizations?: { [lang: string]: string };
    };
  }
  interface DiscoveryMetadata {
    category_ids: number[];
    emoji_discoverability_enabled: boolean;
    guild_id: string;
    keywords: string[] | null;
    primary_category_id: number;
  }
  interface DiscoveryOptions {
    emojiDiscoverabilityEnabled?: boolean;
    keywords?: string[];
    primaryCategoryID?: string;
    reason?: string;
  }
  interface DiscoverySubcategoryResponse {
    category_id: number;
    guild_id: string;
  }
  interface GetGuildAuditLogOptions {
    actionType?: number;
    before?: string;
    limit?: number;
    userID?: string;
  }
  interface GetPruneOptions {
    days?: number;
    includeRoles?: string[];
  }
  interface GetRESTGuildMembersOptions {
    after?: string;
    limit?: number;
  }
  interface GetRESTGuildsOptions {
    after?: string;
    before?: string;
    limit?: number;
  }
  interface GuildAuditLog {
    entries: GuildAuditLogEntry[];
    threads: AnyThreadChannel[];
    users: User[];
    webhooks: Webhook[];
  }
  interface GuildOptions {
    afkChannelID?: string;
    afkTimeout?: number;
    banner?: string;
    defaultNotifications?: DefaultNotifications;
    description?: string;
    discoverySplash?: string;
    explicitContentFilter?: ExplicitContentFilter;
    features?: GuildFeatures[]; // Though only some are editable?
    icon?: string;
    name?: string;
    ownerID?: string;
    preferredLocale?: string;
    publicUpdatesChannelID?: string;
    rulesChannelID?: string;
    splash?: string;
    systemChannelFlags?: number;
    systemChannelID?: string;
    verificationLevel?: VerificationLevel;
  }
  interface GuildVanity {
    code: string | null;
    uses: number;
  }
  interface IntegrationApplication {
    bot?: User;
    description: string;
    icon: string | null;
    id: string;
    name: string;
    summary: string;
  }
  interface IntegrationOptions {
    enableEmoticons?: string;
    expireBehavior?: string;
    expireGracePeriod?: string;
  }
  interface PruneMemberOptions extends GetPruneOptions {
    computePruneCount?: boolean;
    reason?: string;
  }
  interface VoiceRegion {
    custom: boolean;
    deprecated: boolean;
    id: string;
    name: string;
    optimal: boolean;
    vip: boolean;
  }
  interface WelcomeChannel {
    channelID: string;
    description: string;
    emojiID: string | null;
    emojiName: string | null;
  }
  interface WelcomeScreen {
    description: string;
    welcomeChannels: WelcomeChannel[];
  }
  interface WelcomeScreenOptions extends WelcomeScreen {
    enabled: boolean;
  }
  interface Widget {
    channel_id?: string;
    enabled: boolean;
  }
  interface WidgetChannel {
    id: string;
    name: string;
    position: number;
  }
  interface WidgetData {
    channels: WidgetChannel[];
    id: string;
    instant_invite: string;
    members: WidgetMember[];
    name: string;
    presence_count: number;
  }
  interface WidgetMember {
    avatar: string | null;
    avatar_url: string;
    discriminator: string;
    id: string;
    status: string;
    username: string;
  }

  // Invite
  interface CreateInviteOptions {
    maxAge?: number;
    maxUses?: number;
    temporary?: boolean;
    unique?: boolean;
  }
  interface InvitePartialChannel {
    icon?: string | null;
    id: string;
    name: string | null;
    recipients?: { username: string }[];
    type: Exclude<ChannelTypes, 1>;
  }
  interface InviteStageInstance {
    members: Member[];
    participantCount: number;
    speakerCount: number;
    topic: string;
  }

  // Member/User
  interface FetchMembersOptions {
    limit?: number;
    presences?: boolean;
    query?: string;
    timeout?: number;
    userIDs?: string[];
  }
  interface MemberOptions {
    channelID?: string | null;
    deaf?: boolean;
    mute?: boolean;
    nick?: string | null;
    roles?: string[];
  }
  interface MemberPartial {
    id: string;
    user: User;
  }
  interface MemberRoles extends BaseData {
    roles: string[];
  }
  interface PartialUser {
    avatar: string | null;
    discriminator: string;
    id: string;
    username: string;
  }
  interface RequestGuildMembersOptions extends Omit<FetchMembersOptions, "userIDs"> {
    nonce: string;
    user_ids?: string[];
  }
  interface RequestGuildMembersReturn {
    members: Member[];
    received: number;
    res: (value?: unknown) => void;
    timeout: NodeJS.Timer;
  }

  // Message
  interface ActionRow {
    components: ActionRowComponents[];
    type: 1;
  }
  interface ActiveMessages {
    args: string[];
    command: Command;
    timeout: NodeJS.Timer;
  }
  interface AdvancedMessageContent {
    allowedMentions?: AllowedMentions;
    components?: ActionRow[];
    content?: string;
    /** @deprecated */
    embed?: EmbedOptions;
    embeds?: EmbedOptions[];
    flags?: number;
    messageReference?: MessageReferenceReply;
    /** @deprecated */
    messageReferenceID?: string;
    stickerIDs?: string[];
    tts?: boolean;
  }
  interface AdvancedMessageContentEdit extends AdvancedMessageContent {
    file?: MessageFile | MessageFile[];
  }
  interface AllowedMentions {
    everyone?: boolean;
    repliedUser?: boolean;
    roles?: boolean | string[];
    users?: boolean | string[];
  }
  interface Attachment {
    content_type?: string;
    filename: string;
    height?: number;
    id: string;
    proxy_url: string;
    size: number;
    url: string;
    width?: number;
  }
  interface ButtonBase {
    disabled?: boolean;
    emoji?: Partial<PartialEmoji>;
    label?: string;
    type: 2;
  }
  interface SelectMenu {
    custom_id: string;
    disabled?: boolean;
    max_values?: number;
    min_values?: number;
    options: SelectMenuOptions[];
    placeholder?: string;
    type: 3;
  }
  interface SelectMenuOptions {
    default?: boolean;
    description?: string;
    emoji?: Partial<PartialEmoji>;
    label: string;
    value: string;
  }
  interface GetMessageReactionOptions {
    after?: string;
    /** @deprecated */
    before?: string;
    limit?: number;
  }
  interface InteractionButton extends ButtonBase {
    custom_id: string;
    style: 1 | 2 | 3 | 4;
  }
  interface MessageActivity {
    party_id?: string;
    type: Constants["MessageActivityTypes"][keyof Constants["MessageActivityTypes"]];
  }
  interface MessageApplication {
    cover_image?: string;
    description: string;
    icon: string | null;
    id: string;
    name: string;
  }
  interface MessageFile {
    file: Buffer | string;
    name: string;
  }
  interface MessageInteraction {
    id: string;
    member: Member | null;
    name: string;
    type: InteractionType;
    user: User;
  }
  interface MessageReference extends MessageReferenceBase {
    channelID: string;
  }
  interface MessageReferenceBase {
    channelID?: string;
    guildID?: string;
    messageID?: string;
  }
  interface MessageReferenceReply extends MessageReferenceBase {
    messageID: string;
    failIfNotExists?: boolean;
  }
  interface Sticker extends StickerItems {
    /** @deprecated */
    asset: "";
    available?: boolean;
    description: string;
    guild_id?: string;
    pack_id?: string;
    sort_value?: number;
    tags: string;
    user?: User;
  }
  interface StickerItems {
    id: string;
    name: string;
    format_type: Constants["StickerFormats"][keyof Constants["StickerFormats"]];
  }
  interface URLButton extends ButtonBase {
    style: 5;
    url: string;
  }

  // Presence
  interface Activity extends ActivityPartial<ActivityType> {
    application_id?: string;
    assets?: {
      large_image?: string;
      large_text?: string;
      small_image?: string;
      small_text?: string;
      [key: string]: unknown;
    };
    created_at: number;
    details?: string;
    emoji?: { animated?: boolean; id?: string; name: string };
    flags?: number;
    instance?: boolean;
    party?: { id?: string; size?: [number, number] };
    secrets?: { join?: string; spectate?: string; match?: string };
    state?: string;
    timestamps?: { end?: number; start: number };
    // the stuff attached to this object apparently varies even more than documented, so...
    [key: string]: unknown;
  }
  interface ActivityPartial<T extends ActivityType = BotActivityType> {
    name: string;
    type: T;
    url?: string;
  }
  interface ClientPresence {
    activities: Activity[] | null;
    afk: boolean;
    since: number | null;
    status: Status;
  }
  interface ClientStatus {
    desktop: Status;
    mobile: Status;
    web: Status;
  }
  interface Presence {
    activities?: Activity[];
    clientStatus?: ClientStatus;
    status?: Status;
  }

  // Role
  interface Overwrite {
    allow: bigint | number;
    deny: bigint | number;
    id: string;
    type: PermissionType;
  }
  interface PartialRole {
    color?: number;
    hoist?: boolean;
    id: string;
    mentionable?: boolean;
    name?: string;
    permissions?: number;
    position?: number;
  }
  interface RoleOptions {
    color?: number;
    hoist?: boolean;
    mentionable?: boolean;
    name?: string;
    permissions?: bigint | number | string | Permission;
  }
  interface RoleTags {
    bot_id?: string;
    integration_id?: string;
    premium_subscriber?: true;
  }

  // Thread
  interface CreateThreadOptions {
    autoArchiveDuration: AutoArchiveDuration;
    name: string;
  }
  interface CreateThreadWithoutMessageOptions<T = AnyThreadChannel["type"]> extends CreateThreadOptions {
    invitable: T extends PrivateThreadChannel["type"] ? boolean : never;
    type: T;
  }
  interface GetArchivedThreadsOptions {
    before?: Date;
    limit?: number;
  }
  interface ListedChannelThreads<T extends ThreadChannel = AnyThreadChannel> extends ListedGuildThreads<T> {
    hasMore: boolean;
  }
  interface ListedGuildThreads<T extends ThreadChannel = AnyThreadChannel> {
    members: ThreadMember[];
    threads: T[];
  }
  interface PrivateThreadMetadata extends ThreadMetadata {
    invitable: boolean;
  }
  interface ThreadMetadata {
    archiveTimestamp: number;
    archived: boolean;
    autoArchiveDuration: AutoArchiveDuration;
    locked: boolean;
  }

  // Voice
  interface JoinVoiceChannelOptions {
    opusOnly?: boolean;
    selfDeaf?: boolean;
    selfMute?: boolean;
    shared?: boolean;
  }
  interface StageInstanceOptions {
    privacyLevel?: StageInstancePrivacyLevel;
    topic?: string;
  }
  interface UncachedMemberVoiceState {
    id: string;
    voiceState: OldVoiceState;
  }
  interface VoiceConnectData {
    channel_id: string;
    endpoint: string;
    session_id: string;
    token: string;
    user_id: string;
  }
  interface VoiceResourceOptions {
    encoderArgs?: string[];
    format?: string;
    frameDuration?: number;
    frameSize?: number;
    inlineVolume?: boolean;
    inputArgs?: string[];
    pcmSize?: number;
    samplingRate?: number;
    voiceDataTimeout?: number;
  }
  interface VoiceServerUpdateData extends Omit<VoiceConnectData, "channel_id"> {
    guild_id: string;
    shard: Shard;
  }
  interface VoiceStateOptions {
    channelID: string;
    requestToSpeakTimestamp?: Date | null;
    suppress?: boolean;
  }
  interface VoiceStreamCurrent {
    buffer: Buffer | null;
    bufferingTicks: number;
    options: VoiceResourceOptions;
    pausedTime?: number;
    pausedTimestamp?: number;
    playTime: number;
    startTime: number;
    timeout: NodeJS.Timeout | null;
  }

  // Webhook
  interface Webhook {
    application_id: string | null;
    avatar: string | null;
    channel_id: string | null;
    guild_id: string | null;
    id: string;
    name: string;
    source_channel?: { id: string; name: string };
    source_guild: { icon: string | null; id: string; name: string };
    token?: string;
    type: 1 | 2 | 3;
    url?: string;
    user?: PartialUser;
  }
  interface WebhookOptions {
    avatar?: string;
    channelID?: string;
    name?: string;
  }
  interface WebhookPayload {
    allowedMentions?: AllowedMentions;
    auth?: boolean;
    avatarURL?: string;
    components?: ActionRow[];
    content?: string;
    embeds?: EmbedOptions[];
    file?: MessageFile | MessageFile[];
    threadID?: string;
    tts?: boolean;
    username?: string;
    wait?: boolean;
  }

  // TODO: Does this have more stuff?
  interface BaseData {
    id: string;
    [key: string]: unknown;
  }
  interface OAuthApplicationInfo {
    bot_public: boolean;
    bot_require_code_grant: boolean;
    description: string;
    icon?: string;
    id: string;
    name: string;
    owner: {
      avatar?: string;
      discriminator: string;
      id: string;
      username: string;
    };
    team: OAuthTeamInfo | null;
  }
  interface OAuthTeamInfo {
    icon: string | null;
    id: string;
    members: OAuthTeamMember[];
    owner_user_id: string;
  }
  interface OAuthTeamMember {
    membership_state: number;
    permissions: string[];
    team_id: string;
    user: PartialUser;
  }
  interface Constants {
    AuditLogActions: {
      GUILD_UPDATE: 1;

      CHANNEL_CREATE: 10;
      CHANNEL_UPDATE: 11;
      CHANNEL_DELETE: 12;
      CHANNEL_OVERWRITE_CREATE: 13;
      CHANNEL_OVERWRITE_UPDATE: 14;
      CHANNEL_OVERWRITE_DELETE: 15;

      MEMBER_KICK: 20;
      MEMBER_PRUNE: 21;
      MEMBER_BAN_ADD: 22;
      MEMBER_BAN_REMOVE: 23;
      MEMBER_UPDATE: 24;
      MEMBER_ROLE_UPDATE: 25;
      MEMBER_MOVE: 26;
      MEMBER_DISCONNECT: 27;
      BOT_ADD: 28;

      ROLE_CREATE: 30;
      ROLE_UPDATE: 31;
      ROLE_DELETE: 32;

      INVITE_CREATE: 40;
      INVITE_UPDATE: 41;
      INVITE_DELETE: 42;

      WEBHOOK_CREATE: 50;
      WEBHOOK_UPDATE: 51;
      WEBHOOK_DELETE: 52;

      EMOJI_CREATE: 60;
      EMOJI_UPDATE: 61;
      EMOJI_DELETE: 62;

      MESSAGE_DELETE: 72;
      MESSAGE_BULK_DELETE: 73;
      MESSAGE_PIN: 74;
      MESSAGE_UNPIN: 75;

      INTEGRATION_CREATE: 80;
      INTEGRATION_UPDATE: 81;
      INTEGRATION_DELETE: 82;
      STAGE_INSTANCE_CREATE: 83;
      STAGE_INSTANCE_UPDATE: 84;
      STAGE_INSTANCE_DELETE: 85;

      THREAD_CREATE: 110;
      THREAD_UPDATE: 111;
      THREAD_DELETE: 112;
    };
    ChannelTypes: {
      GUILD_TEXT: 0;
      DM: 1;
      GUILD_VOICE: 2;
      GROUP_DM: 3;
      GUILD_CATEGORY: 4;
      GUILD_NEWS: 5;
      GUILD_STORE: 6;
      GUILD_NEWS_THREAD: 10;
      GUILD_PUBLIC_THREAD: 11;
      GUILD_PRIVATE_THREAD: 12;
      GUILD_STAGE: 13;
    };
    GATEWAY_VERSION: 9;
    GatewayOPCodes: {
      EVENT: 0;
      HEARTBEAT: 1;
      IDENTIFY: 2;
      STATUS_UPDATE: 3;
      VOICE_STATE_UPDATE: 4;
      VOICE_SERVER_PING: 5;
      RESUME: 6;
      RECONNECT: 7;
      GET_GUILD_MEMBERS: 8;
      INVALID_SESSION: 9;
      HELLO: 10;
      HEARTBEAT_ACK: 11;
      SYNC_GUILD: 12;
      SYNC_CALL: 13;
    };
    ImageFormats: ["jpg", "jpeg", "png", "webp", "gif"];
    ImageSizeBoundaries: {
      MAXIMUM: 4096;
      MINIMUM: 16;
    };
    Intents: {
      guilds: 1;
      guildMembers: 2;
      guildBans: 4;
      guildEmojisAndStickers: 8;
      /** @deprecated */
      guildEmojis: 8;
      guildIntegrations: 16;
      guildWebhooks: 32;
      guildInvites: 64;
      guildVoiceStates: 128;
      guildPresences: 256;
      guildMessages: 512;
      guildMessageReactions: 1024;
      guildMessageTyping: 2048;
      directMessages: 4096;
      directMessageReactions: 8192;
      directMessageTyping: 16384;
    };
    MessageActivityTypes: {
      JOIN: 1;
      SPECTATE: 2;
      LISTEN: 3;
      JOIN_REQUEST: 5;
    };
    MessageFlags: {
      CROSSPOSTED: 0;
      IS_CROSSPOST: 2;
      SUPPRESS_EMBEDS: 4;
      SOURCE_MESSAGE_DELETED: 8;
      URGENT: 16;
      HAS_THREAD: 32;
    };
    MessageTypes: {
      DEFAULT: 0;
      RECIPIENT_ADD: 1;
      RECIPIENT_REMOVE: 2;
      CALL: 3;
      CHANNEL_NAME_CHANGE: 4;
      CHANNEL_ICON_CHANGE: 5;
      CHANNEL_PINNED_MESSAGE: 6;
      GUILD_MEMBER_JOIN: 7;
      USER_PREMIUM_GUILD_SUBSCRIPTION: 8;
      USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_1: 9;
      USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_2: 10;
      USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3: 11;
      CHANNEL_FOLLOW_ADD: 12;

      GUILD_DISCOVERY_DISQUALIFIED: 14;
      GUILD_DISCOVERY_REQUALIFIED: 15;
      GUILD_DISCOVERY_GRACE_PERIOD_INITIAL_WARNING: 16;
      GUILD_DISCOVERY_GRACE_PERIOD_FINAL_WARNING: 17;
      THREAD_CREATED: 18;
      REPLY: 19;
      APPLICATION_COMMAND: 20;
      THREAD_STARTER_MESSAGE: 21;
      GUILD_INVITE_REMINDER: 22;
    };
    Permissions: {
      createInstantInvite: 1n;
      kickMembers: 2n;
      banMembers: 4n;
      administrator: 8n;
      manageChannels: 16n;
      manageGuild: 32n;
      addReactions: 64n;
      viewAuditLog: 128n;
      /** @deprecated */
      viewAuditLogs: 128n;
      voicePrioritySpeaker: 256n;
      voiceStream: 512n;
      /** @deprecated */
      stream: 512n;
      viewChannel: 1024n;
      /** @deprecated */
      readMessages: 1024n;
      sendMessages: 2048n;
      sendTTSMessages: 4096n;
      manageMessages: 8192n;
      embedLinks: 16384n;
      attachFiles: 32768n;
      readMessageHistory: 65536n;
      mentionEveryone: 131072n;
      useExternalEmojis: 262144n;
      /** @deprecated */
      externalEmojis: 262144n;
      viewGuildInsights: 524288n;
      voiceConnect: 1048576n;
      voiceSpeak: 2097152n;
      voiceMuteMembers: 4194304n;
      voiceDeafenMembers: 8388608n;
      voiceMoveMembers: 16777216n;
      voiceUseVAD: 33554432n;
      changeNickname: 67108864n;
      manageNicknames: 134217728n;
      manageRoles: 268435456n;
      manageWebhooks: 536870912n;
      manageEmojisAndStickers: 1073741824n;
      /** @deprecated */
      manageEmojis: 1073741824n;
      useApplicationCommands: 2147483648n;
      /** @deprecated */
      useSlashCommands: 2147483648n;
      voiceRequestToSpeak: 4294967296n;
      manageThreads: 17179869184n;
      createPublicThreads: 34359738368n;
      createPrivateThreads: 68719476736n;
      useExternalStickers: 137438953472n;
      sendMessagesInThreads: 274877906944n;
      allGuild: 2080899262n;
      allText: 535529258065n;
      allVoice: 4629464849n;
      all: 541165879295n;
    };
    REST_VERSION: 9;
    StickerFormats: {
      PNG: 1;
      APNG: 2;
      LOTTIE: 3;
    };
    SystemJoinMessages: [
      "%user% joined the party.",
      "%user% is here.",
      "Welcome, %user%. We hope you brought pizza.",
      "A wild %user% appeared.",
      "%user% just landed.",
      "%user% just slid into the server.",
      "%user% just showed up!",
      "Welcome %user%. Say hi!",
      "%user% hopped into the server.",
      "Everyone welcome %user%!",
      "Glad you're here, %user%.",
      "Good to see you, %user%.",
      "Yay you made it, %user%!"
    ];
    UserFlags: {
      NONE: 0;
      DISCORD_EMPLOYEE: 1;
      PARTNERED_SERVER_OWNER: 2;
      /** @deprecated */
      DISCORD_PARTNER: 2;
      HYPESQUAD_EVENTS: 4;
      BUG_HUNTER_LEVEL_1: 8;
      HOUSE_BRAVERY: 64;
      HOUSE_BRILLIANCE: 128;
      HOUSE_BALANCE: 256;
      EARLY_SUPPORTER: 512;
      TEAM_USER: 1024;
      SYSTEM: 4096;
      BUG_HUNTER_LEVEL_2: 16384;
      VERIFIED_BOT: 65536;
      EARLY_VERIFIED_BOT_DEVELOPER: 131072;
      /** @deprecated */
      VERIFIED_BOT_DEVELOPER: 131072;
      DISCORD_CERTIFIED_MODERATOR: 262144;
    };
    VoiceOPCodes: {
      IDENTIFY: 0;
      SELECT_PROTOCOL: 1;
      READY: 2;
      HEARTBEAT: 3;
      SESSION_DESCRIPTION: 4;
      SPEAKING: 5;
      HEARTBEAT_ACK: 6;
      RESUME: 7;
      HELLO: 8;
      RESUMED: 9;
      DISCONNECT: 13;
    };
  }

  // Selfbot
  interface Connection {
    friend_sync: boolean;
    id: string;
    integrations: unknown[]; // TODO ????
    name: string;
    revoked: boolean;
    type: string;
    verified: boolean;
    visibility: number;
  }
  interface GuildSettings {
    channel_override: {
      channel_id: string;
      message_notifications: number;
      muted: boolean;
    }[];
    guild_id: string;
    message_notifications: number;
    mobile_push: boolean;
    muted: boolean;
    suppress_everyone: boolean;
  }
  interface SearchOptions {
    attachmentExtensions?: string;
    attachmentFilename?: string;
    authorID?: string;
    channelIDs?: string[];
    content?: string;
    contextSize?: number;
    embedProviders?: string;
    embedTypes?: string;
    has?: string;
    limit?: number;
    maxID?: string;
    minID?: string;
    offset?: number;
    sortBy?: string;
    sortOrder?: string;
  }
  interface SearchResults {
    results: (Message & { hit?: boolean })[][];
    totalResults: number;
  }
  interface UserProfile {
    connected_accounts: { id: string; name: string; type: string; verified: boolean }[];
    mutual_guilds: { id: string; nick?: string }[];
    premium_since?: number;
    user: PartialUser & { flags: number };
  }

  class Base implements SimpleJSON {
    createdAt: number;
    id: string;
    constructor(id: string);
    static getCreatedAt(id: string): number;
    static getDiscordEpoch(id: string): number;
    inspect(): this;
    toString(): string;
    toJSON(props?: string[]): JSONCache;
  }

  export class Bucket {
    interval: number;
    lastReset: number;
    lastSend: number;
    tokenLimit: number;
    tokens: number;
    constructor(tokenLimit: number, interval: number, options: { latencyRef: { latency: number }; reservedTokens: number });
    check(): void;
    queue(func: () => void, priority?: boolean): void;
  }

  export class BrowserWebSocket extends EventEmitter {
    static CONNECTING: 0;
    static OPEN: 1;
    static CLOSING: 2;
    static CLOSED: 3;
    readyState: number;
    constructor(url: string);
    close(code?: number, reason?: string): void;
    removeEventListener(event: string | symbol, listener: (...args: any[]) => void): this;
    // @ts-ignore: DOM
    send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void;
    terminate(): void;
  }

  export class BrowserWebSocketError extends Error {
    // @ts-ignore: DOM
    event: Event;
    // @ts-ignore: DOM
    constructor(message: string, event: Event);
  }

  export class CategoryChannel extends GuildChannel {
    channels: Collection<Exclude<AnyGuildChannel, CategoryChannel>>;
    type: 4;
    edit(options: Omit<CreateChannelOptions, "permissionOverwrites" | "reason">, reason?: string): Promise<this>;
  }

  export class Channel extends Base {
    client: Client;
    createdAt: number;
    id: string;
    mention: string;
    type: ChannelTypes;
    constructor(data: BaseData, client: Client);
    static from(data: BaseData, client: Client): AnyChannel;
  }

  export class Client extends EventEmitter {
    application?: { id: string; flags: number };
    bot: boolean;
    channelGuildMap: { [s: string]: string };
    gatewayURL?: string;
    guilds: Collection<Guild>;
    guildShardMap: { [s: string]: number };
    lastConnect: number;
    lastReconnectDelay: number;
    options: ClientOptions;
    presence: ClientPresence;
    privateChannelMap: { [s: string]: string };
    privateChannels: Collection<PrivateChannel>;
    ready: boolean;
    reconnectAttempts: number;

    requestHandler: RequestHandler;
    shards: ShardManager;
    startTime: number;
    threadGuildMap: { [s: string]: string };
    unavailableGuilds: Collection<UnavailableGuild>;
    uptime: number;
    user: ExtendedUser;
    users: Collection<User>;
    voiceConnections: VoiceConnectionManager;
    constructor(token: string, options: ClientOptions);
    addGroupRecipient(groupID: string, userID: string): Promise<void>;
    addGuildDiscoverySubcategory(guildID: string, categoryID: string, reason?: string): Promise<DiscoverySubcategoryResponse>;
    addGuildMemberRole(guildID: string, memberID: string, roleID: string, reason?: string): Promise<void>;
    addMessageReaction(channelID: string, messageID: string, reaction: string): Promise<void>;
    /** @deprecated */
    addMessageReaction(channelID: string, messageID: string, reaction: string, userID: string): Promise<void>;
    addSelfPremiumSubscription(token: string, plan: string): Promise<void>;
    banGuildMember(guildID: string, userID: string, deleteMessageDays?: number, reason?: string): Promise<void>;
    closeVoiceConnection(guildID: string): void;
    connect(): Promise<void>;
    createChannel(guildID: string, name: string): Promise<TextChannel>;
    createChannel(
      guildID: string,
      name: string,
      type: 0,
      options?: CreateChannelOptions
    ): Promise<TextChannel>;
    createChannel(
      guildID: string,
      name: string,
      type: 2,
      options?: CreateChannelOptions
    ): Promise<VoiceChannel>;
    createChannel(
      guildID: string,
      name: string,
      type: 4,
      options?: CreateChannelOptions
    ): Promise<CategoryChannel>;
    createChannel(
      guildID: string,
      name: string,
      type: 5,
      options?: CreateChannelOptions
    ): Promise<NewsChannel>;
    createChannel(
      guildID: string,
      name: string,
      type: 6,
      options?: CreateChannelOptions
    ): Promise<StoreChannel>;
    createChannel(
      guildID: string,
      name: string,
      type: 13,
      options?: CreateChannelOptions
    ): Promise<StageChannel>;
    createChannel(
      guildID: string,
      name: string,
      type?: number,
      options?: CreateChannelOptions
    ): Promise<unknown>;
    /** @deprecated */
    createChannel(
      guildID: string,
      name: string,
      type: 0,
      reason?: string,
      options?: CreateChannelOptions | string
    ): Promise<TextChannel>;
    /** @deprecated */
    createChannel(
      guildID: string,
      name: string,
      type: 2,
      reason?: string,
      options?: CreateChannelOptions | string
    ): Promise<VoiceChannel>;
    /** @deprecated */
    createChannel(
      guildID: string,
      name: string,
      type: 4,
      reason?: string,
      options?: CreateChannelOptions | string
    ): Promise<CategoryChannel>;
    /** @deprecated */
    createChannel(
      guildID: string,
      name: string,
      type: 5,
      reason?: string,
      options?: CreateChannelOptions | string
    ): Promise<NewsChannel>;
    /** @deprecated */
    createChannel(
      guildID: string,
      name: string,
      type: 6,
      reason?: string,
      options?: CreateChannelOptions | string
    ): Promise<StoreChannel>;
    /** @deprecated */
    createChannel(
      guildID: string,
      name: string,
      type: 13,
      reason?: string,
      options?: CreateChannelOptions | string
    ): Promise<StageChannel>;
    /** @deprecated */
    createChannel(
      guildID: string,
      name: string,
      type?: number,
      reason?: string,
      options?: CreateChannelOptions | string
    ): Promise<unknown>;
    createChannelWebhook(
      channelID: string,
      options: { name: string; avatar?: string | null },
      reason?: string
    ): Promise<Webhook>;
    createGuild(name: string, options?: CreateGuildOptions): Promise<Guild>;
    createGuildEmoji(guildID: string, options: EmojiOptions, reason?: string): Promise<Emoji>;
    createGuildFromTemplate(code: string, name: string, icon?: string): Promise<Guild>;
    createMessage(channelID: string, content: MessageContent, file?: MessageFile | MessageFile[]): Promise<Message>;
    createRole(guildID: string, options?: RoleOptions | Role, reason?: string): Promise<Role>;
    createStageInstance(channelID: string, options: StageInstanceOptions): Promise<StageInstance>;
    createThreadWithMessage(channelID: string, messageID: string, options: CreateThreadOptions): Promise<NewsThreadChannel | PublicThreadChannel>;
    createThreadWithoutMessage(channelID: string, options: CreateThreadWithoutMessageOptions): Promise<PrivateThreadChannel>;
    crosspostMessage(channelID: string, messageID: string): Promise<Message>;
    deleteChannel(channelID: string, reason?: string): Promise<void>;
    deleteChannelPermission(channelID: string, overwriteID: string, reason?: string): Promise<void>;
    deleteGuild(guildID: string): Promise<void>;
    deleteGuildDiscoverySubcategory(guildID: string, categoryID: string, reason?: string): Promise<void>;
    deleteGuildEmoji(guildID: string, emojiID: string, reason?: string): Promise<void>;
    deleteInvite(inviteID: string, reason?: string): Promise<void>;
    deleteMessage(channelID: string, messageID: string, reason?: string): Promise<void>;
    deleteMessages(channelID: string, messageIDs: string[], reason?: string): Promise<void>;
    deleteRole(guildID: string, roleID: string, reason?: string): Promise<void>;
    deleteSelfConnection(platform: string, id: string): Promise<void>;
    deleteSelfPremiumSubscription(): Promise<void>;
    deleteStageInstance(channelID: string): Promise<void>;
    deleteUserNote(userID: string): Promise<void>;
    deleteWebhook(webhookID: string, token?: string, reason?: string): Promise<void>;
    deleteWebhookMessage(webhookID: string, token: string, messageID: string): Promise<void>;
    disableSelfMFATOTP(code: string): Promise<{ token: string }>;
    disconnect(options: { reconnect?: boolean | "auto" }): void;
    editAFK(afk: boolean): void;
    editChannel(
      channelID: string,
      options: EditChannelOptions,
      reason?: string
    ): Promise<AnyGuildChannel>;
    editChannelPermission(
      channelID: string,
      overwriteID: string,
      allow: bigint | number,
      deny: bigint | number,
      type: PermissionType,
      reason?: string
    ): Promise<void>;
    editChannelPosition(channelID: string, position: number, options?: EditChannelPositionOptions): Promise<void>;
    editGuild(guildID: string, options: GuildOptions, reason?: string): Promise<Guild>;
    editGuildDiscovery(guildID: string, options?: DiscoveryOptions): Promise<DiscoveryMetadata>;
    editGuildEmoji(
      guildID: string,
      emojiID: string,
      options: { name?: string; roles?: string[] },
      reason?: string
    ): Promise<Emoji>;
    editGuildMember(guildID: string, memberID: string, options: MemberOptions, reason?: string): Promise<Member>;
    editGuildVanity(guildID: string, code: string | null): Promise<GuildVanity>;
    editGuildVoiceState(guildID: string, options: VoiceStateOptions, userID?: string): Promise<void>;
    editGuildWelcomeScreen(guildID: string, options: WelcomeScreenOptions): Promise<WelcomeScreen>;
    editGuildWidget(guildID: string, options: Widget): Promise<Widget>;
    editMessage(channelID: string, messageID: string, content: MessageContentEdit): Promise<Message>;
    /** @deprecated */
    editNickname(guildID: string, nick: string, reason?: string): Promise<void>;
    editRole(guildID: string, roleID: string, options: RoleOptions, reason?: string): Promise<Role>; // TODO not all options are available?
    editRolePosition(guildID: string, roleID: string, position: number): Promise<void>;
    editSelf(options: { avatar?: string; username?: string }): Promise<ExtendedUser>;
    editSelfConnection(
      platform: string,
      id: string,
      data: { friendSync: boolean; visibility: number }
    ): Promise<Connection>;
    editStageInstance(channelID: string, options: StageInstanceOptions): Promise<StageInstance>;
    editStatus(status: Status, activities?: ActivityPartial<BotActivityType>[] | ActivityPartial<BotActivityType>): void;
    editStatus(activities?: ActivityPartial<BotActivityType>[] | ActivityPartial<BotActivityType>): void;
    editUserNote(userID: string, note: string): Promise<void>;
    editWebhook(
      webhookID: string,
      options: WebhookOptions,
      token?: string,
      reason?: string
    ): Promise<Webhook>;
    editWebhookMessage(
      webhookID: string,
      token: string,
      messageID: string,
      options: MessageWebhookContent
    ): Promise<Message<GuildTextableChannel>>;
    enableSelfMFATOTP(
      secret: string,
      code: string
    ): Promise<{ backup_codes: { code: string; consumed: boolean }[]; token: string }>;
    executeSlackWebhook(webhookID: string, token: string, options: Record<string, unknown> & { auth?: boolean; threadID?: string }): Promise<void>;
    executeSlackWebhook(webhookID: string, token: string, options: Record<string, unknown> & { auth?: boolean; threadID?: string; wait: true }): Promise<Message<GuildTextableChannel>>;
    executeWebhook(webhookID: string, token: string, options: WebhookPayload & { wait: true }): Promise<Message<GuildTextableChannel>>;
    executeWebhook(webhookID: string, token: string, options: WebhookPayload): Promise<void>;
    followChannel(channelID: string, webhookChannelID: string): Promise<ChannelFollow>;
    getActiveGuildThreads(guildID: string): Promise<ListedGuildThreads>;
    /** @deprecated */
    getActiveThreads(channelID: string): Promise<ListedChannelThreads>;
    getArchivedThreads(channelID: string, type: "private", options?: GetArchivedThreadsOptions): Promise<ListedChannelThreads<PrivateThreadChannel>>;
    getArchivedThreads(channelID: string, type: "public", options?: GetArchivedThreadsOptions): Promise<ListedChannelThreads<PublicThreadChannel>>;
    getBotGateway(): Promise<{ session_start_limit: { max_concurrency: number; remaining: number; reset_after: number; total: number }; shards: number; url: string }>;
    getChannel(channelID: string): AnyChannel;
    getChannelWebhooks(channelID: string): Promise<Webhook[]>;
    getDiscoveryCategories(): Promise<DiscoveryCategory[]>;
    getDMChannel(userID: string): Promise<PrivateChannel>;
    getEmojiGuild(emojiID: string): Promise<Guild>;
    getGateway(): Promise<{ url: string }>;
    getGuildAuditLog(guildID: string, options?: GetGuildAuditLogOptions): Promise<GuildAuditLog>;
    /** @deprecated */
    getGuildAuditLogs(guildID: string, limit?: number, before?: string, actionType?: number, userID?: string): Promise<GuildAuditLog>;
    getGuildBan(guildID: string, userID: string): Promise<{ reason?: string; user: User }>;
    getGuildBans(guildID: string): Promise<{ reason?: string; user: User }[]>;
    getGuildDiscovery(guildID: string): Promise<DiscoveryMetadata>;
    /** @deprecated */
    getGuildEmbed(guildID: string): Promise<Widget>;
    getGuildVanity(guildID: string): Promise<GuildVanity>;
    getGuildWebhooks(guildID: string): Promise<Webhook[]>;
    getGuildWelcomeScreen(guildID: string): Promise<WelcomeScreen>;
    getGuildWidget(guildID: string): Promise<WidgetData>;
    getGuildWidgetSettings(guildID: string): Promise<Widget>;
    getJoinedPrivateArchivedThreads(channelID: string, options?: GetArchivedThreadsOptions): Promise<ListedChannelThreads<PrivateThreadChannel>>;
    getMessage(channelID: string, messageID: string): Promise<Message>;
    getMessageReaction(channelID: string, messageID: string, reaction: string, options?: GetMessageReactionOptions): Promise<User[]>;
    /** @deprecated */
    getMessageReaction(channelID: string, messageID: string, reaction: string, limit?: number, before?: string, after?: string): Promise<User[]>;
    getMessages(channelID: string, options?: GetMessagesOptions): Promise<Message[]>;
    /** @deprecated */
    getMessages(channelID: string, limit?: number, before?: string, after?: string, around?: string): Promise<Message[]>;
    getOAuthApplication(appID?: string): Promise<OAuthApplicationInfo>;
    getPins(channelID: string): Promise<Message[]>;
    getPruneCount(guildID: string, options?: GetPruneOptions): Promise<number>;
    getRESTChannel(channelID: string): Promise<AnyChannel>;
    getRESTGuild(guildID: string, withCounts?: boolean): Promise<Guild>;
    getRESTGuildChannels(guildID: string): Promise<AnyGuildChannel[]>;
    getRESTGuildEmoji(guildID: string, emojiID: string): Promise<Emoji>;
    getRESTGuildEmojis(guildID: string): Promise<Emoji[]>;
    getRESTGuildMember(guildID: string, memberID: string): Promise<Member>;
    getRESTGuildMembers(guildID: string, options?: GetRESTGuildMembersOptions): Promise<Member[]>;
    /** @deprecated */
    getRESTGuildMembers(guildID: string, limit?: number, after?: string): Promise<Member[]>;
    getRESTGuildRoles(guildID: string): Promise<Role[]>;
    getRESTGuilds(options?: GetRESTGuildsOptions): Promise<Guild[]>;
    /** @deprecated */
    getRESTGuilds(limit?: number, before?: string, after?: string): Promise<Guild[]>;
    getRESTUser(userID: string): Promise<User>;
    getSelf(): Promise<ExtendedUser>;
    getSelfBilling(): Promise<{
      payment_gateway?: string;
      payment_source?: {
        brand: string;
        expires_month: number;
        expires_year: number;
        invalid: boolean;
        last_4: number;
        type: string;
      };
      premium_subscription?: {
        canceled_at?: string;
        created_at: string;
        current_period_end?: string;
        current_period_start?: string;
        ended_at?: string;
        plan: string;
        status: number;
      };
    }>;
    getSelfConnections(): Promise<Connection[]>;
    getSelfMFACodes(
      password: string,
      regenerate?: boolean
    ): Promise<{ backup_codes: { code: string; consumed: boolean }[] }>;
    getSelfPayments(): Promise<{
      amount: number;
      amount_refunded: number;
      created_at: string; // date
      currency: string;
      description: string;
      status: number;
    }[]>;
    getStageInstance(channelID: string): Promise<StageInstance>;
    getThreadMembers(channelID: string): Promise<ThreadMember[]>;
    getUserProfile(userID: string): Promise<UserProfile>;
    getVoiceRegions(guildID?: string): Promise<VoiceRegion[]>;
    getWebhook(webhookID: string, token?: string): Promise<Webhook>;
    getWebhookMessage(webhookID: string, token: string, messageID: string): Promise<Message<GuildTextableChannel>>;
    joinThread(channelID: string, userID?: string): Promise<void>;
    joinVoiceChannel(channelID: string, options?: JoinVoiceChannelOptions): Promise<VoiceConnection>;
    kickGuildMember(guildID: string, userID: string, reason?: string): Promise<void>;
    leaveGuild(guildID: string): Promise<void>;
    leaveThread(channelID: string, userID?: string): Promise<void>;
    leaveVoiceChannel(channelID: string): void;
    pinMessage(channelID: string, messageID: string): Promise<void>;
    pruneMembers(guildID: string, options?: PruneMemberOptions): Promise<number>;
    purgeChannel(channelID: string, options: PurgeChannelOptions): Promise<number>;
    /** @deprecated */
    purgeChannel(
      channelID: string,
      limit?: number,
      filter?: (m: Message<GuildTextableChannel>) => boolean,
      before?: string,
      after?: string,
      reason?: string
    ): Promise<number>;
    removeGroupRecipient(groupID: string, userID: string): Promise<void>;
    removeGuildMemberRole(guildID: string, memberID: string, roleID: string, reason?: string): Promise<void>;
    removeMessageReaction(channelID: string, messageID: string, reaction: string, userID?: string): Promise<void>;
    removeMessageReactionEmoji(channelID: string, messageID: string, reaction: string): Promise<void>;
    removeMessageReactions(channelID: string, messageID: string): Promise<void>;
    searchChannelMessages(channelID: string, query: SearchOptions): Promise<SearchResults>;
    searchGuildMembers(guildID: string, query: string, limit?: number): Promise<Member[]>;
    searchGuildMessages(guildID: string, query: SearchOptions): Promise<SearchResults>;
    sendChannelTyping(channelID: string): Promise<void>;
    unbanGuildMember(guildID: string, userID: string, reason?: string): Promise<void>;
    unpinMessage(channelID: string, messageID: string): Promise<void>;
    validateDiscoverySearchTerm(term: string): Promise<{ valid: boolean }>;
    emit<K extends keyof ClientEvents>(event: K, ...args: ClientEvents[K]): boolean;
    emit(event: string, ...args: any[]): boolean;
    on<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => void): this;
    on(event: string, listener: (...args: any[]) => void): this;
    once<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => void): this;
    once(event: string, listener: (...args: any[]) => void): this;
    off<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => void): this;
    off(event: string, listener: (...args: any[]) => void): this;
    toString(): string;
  }

  export class Collection<T extends { id: string | number }> extends Map<string | number, T> {
    baseObject: new (...args: any[]) => T;
    limit?: number;
    constructor(baseObject: new (...args: any[]) => T, limit?: number);
    add(obj: T, extra?: unknown, replace?: boolean): T;
    every(func: (i: T) => boolean): boolean;
    filter(func: (i: T) => boolean): T[];
    find(func: (i: T) => boolean): T | undefined;
    map<R>(func: (i: T) => R): R[];
    random(): T | undefined;
    reduce<U>(func: (accumulator: U, val: T) => U, initialValue?: U): U;
    remove(obj: T | Uncached): T | null;
    some(func: (i: T) => boolean): boolean;
    update(obj: T, extra?: unknown, replace?: boolean): T;
  }

  export class Command implements CommandOptions, SimpleJSON {
    aliases: string[];
    argsRequired: boolean;
    caseInsensitive: boolean;
    cooldown: number;
    cooldownExclusions: CommandCooldownExclusions;
    cooldownMessage: MessageContent | false | GenericCheckFunction<MessageContent>;
    cooldownReturns: number;
    defaultSubcommandOptions: CommandOptions;
    deleteCommand: boolean;
    description: string;
    dmOnly: boolean;
    errorMessage: MessageContent | GenericCheckFunction<MessageContent>;
    fullDescription: string;
    fullLabel: string;
    guildOnly: boolean;
    hidden: boolean;
    hooks: Hooks;
    invalidUsageMessage: MessageContent | false | GenericCheckFunction<MessageContent>;
    label: string;
    parentCommand?: Command;
    permissionMessage: MessageContent | false | GenericCheckFunction<MessageContent>;
    reactionButtons: null | CommandReactionButtons[];
    reactionButtonTimeout: number;
    requirements: CommandRequirements;
    restartCooldown: boolean;
    subcommandAliases: { [alias: string]: string };
    subcommands: { [s: string]: Command };
    usage: string;
    constructor(label: string, generate: CommandGenerator, options?: CommandOptions);
    cooldownCheck(msg: Message): boolean;
    cooldownExclusionCheck(msg: Message): boolean;
    executeCommand(msg: Message, args: string[]): Promise<GeneratorFunctionReturn>;
    permissionCheck(msg: Message): Promise<boolean>;
    process(args: string[], msg: Message): Promise<void | GeneratorFunctionReturn>;
    registerSubcommand(label: string, generator: CommandGenerator, options?: CommandOptions): Command;
    registerSubcommandAlias(alias: string, label: string): void;
    unregisterSubcommand(label: string): void;
    toString(): string;
    toJSON(props?: string[]): JSONCache;
  }

  export class CommandClient extends Client {
    activeMessages: { [s: string]: ActiveMessages };
    commandAliases: { [s: string]: string };
    commandOptions: CommandClientOptions;
    commands: { [s: string]: Command };
    guildPrefixes: { [s: string]: string | string[] };
    preReady?: true;
    constructor(token: string, options: ClientOptions, commandOptions?: CommandClientOptions);
    checkPrefix(msg: Message): string;
    onMessageCreate(msg: Message): Promise<void>;
    onMessageReactionEvent(msg: Message, emoji: Emoji, reactor: Member | Uncached | string): Promise<void>
    registerCommand(label: string, generator: CommandGenerator, options?: CommandOptions): Command;
    registerCommandAlias(alias: string, label: string): void;
    registerGuildPrefix(guildID: string, prefix: string[] | string): void;
    resolveCommand(label: string): Command;
    unregisterCommand(label: string): void;
    unwatchMessage(id: string, channelID: string): void;
    toString(): string;
  }

  export class DiscordHTTPError extends Error {
    code: number;
    name: "DiscordHTTPError";
    req: ClientRequest;
    res: IncomingMessage;
    response: HTTPResponse;
    constructor(req: ClientRequest, res: IncomingMessage, response: HTTPResponse, stack: string);
    flattenErrors(errors: HTTPResponse, keyPrefix?: string): string[];
  }

  export class DiscordRESTError extends Error {
    code: number;
    name: string;
    req: ClientRequest;
    res: IncomingMessage;
    response: HTTPResponse;
    constructor(req: ClientRequest, res: IncomingMessage, response: HTTPResponse, stack: string);
    flattenErrors(errors: HTTPResponse, keyPrefix?: string): string[];
  }

  export class ExtendedUser extends User {
    email: string;
    mfaEnabled: boolean;
    premiumType: 0 | 1 | 2;
    verified: boolean;
  }

  export class Guild extends Base {
    afkChannelID: string | null;
    afkTimeout: number;
    applicationID: string | null;
    approximateMemberCount?: number;
    approximatePresenceCount?: number;
    autoRemoved?: boolean;
    banner: string | null;
    bannerURL: string | null;
    channels: Collection<AnyGuildChannel>;
    createdAt: number;
    defaultNotifications: DefaultNotifications;
    description: string | null;
    discoverySplash: string | null;
    discoverySplashURL: string | null;
    emojiCount?: number;
    emojis: Emoji[];
    explicitContentFilter: ExplicitContentFilter;
    features: GuildFeatures[];
    icon: string | null;
    iconURL: string | null;
    id: string;
    joinedAt: number;
    large: boolean;
    maxMembers: number;
    maxPresences: number;
    maxVideoChannelUsers?: number;
    memberCount: number;
    members: Collection<Member>;
    mfaLevel: MFALevel;
    name: string;
    /** @deprecated */
    nsfw: boolean;
    nsfwLevel: NSFWLevel;
    ownerID: string;
    preferredLocale: string;
    premiumSubscriptionCount?: number;
    premiumTier: PremiumTier;
    primaryCategory?: DiscoveryCategory;
    primaryCategoryID?: number;
    publicUpdatesChannelID: string;
    roles: Collection<Role>;
    rulesChannelID: string | null;
    shard: Shard;
    splash: string | null;
    splashURL: string | null;
    stageInstances: Collection<StageInstance>;
    systemChannelFlags: number;
    systemChannelID: string | null;
    threads: Collection<ThreadChannel>;
    unavailable: boolean;
    vanityURL: string | null;
    verificationLevel: VerificationLevel;
    voiceStates: Collection<VoiceState>;
    welcomeScreen?: WelcomeScreen;
    widgetChannelID?: string | null;
    widgetEnabled?: boolean | null;
    constructor(data: BaseData, client: Client);
    addDiscoverySubcategory(categoryID: string, reason?: string): Promise<DiscoverySubcategoryResponse>;
    addMemberRole(memberID: string, roleID: string, reason?: string): Promise<void>;
    banMember(userID: string, deleteMessageDays?: number, reason?: string): Promise<void>;
    createChannel(name: string): Promise<TextChannel>;
    createChannel(name: string, type: 0, options?: CreateChannelOptions): Promise<TextChannel>;
    createChannel(name: string, type: 2, options?: CreateChannelOptions): Promise<VoiceChannel>;
    createChannel(name: string, type: 4, options?: CreateChannelOptions): Promise<CategoryChannel>;
    createChannel(name: string, type: 5, options?: CreateChannelOptions | string): Promise<NewsChannel>;
    createChannel(name: string, type: 6, options?: CreateChannelOptions | string): Promise<StoreChannel>;
    createChannel(name: string, type: 13, options?: CreateChannelOptions | string): Promise<StageChannel>;
    createChannel(name: string, type?: number, options?: CreateChannelOptions): Promise<unknown>;
    /** @deprecated */
    createChannel(name: string, type: 0, reason?: string, options?: CreateChannelOptions | string): Promise<TextChannel>;
    /** @deprecated */
    createChannel(name: string, type: 2, reason?: string, options?: CreateChannelOptions | string): Promise<VoiceChannel>;
    /** @deprecated */
    createChannel(name: string, type: 4, reason?: string, options?: CreateChannelOptions | string): Promise<CategoryChannel>;
    /** @deprecated */
    createChannel(name: string, type: 5, reason?: string, options?: CreateChannelOptions | string): Promise<NewsChannel>;
    /** @deprecated */
    createChannel(name: string, type: 6, reason?: string, options?: CreateChannelOptions | string): Promise<StoreChannel>;
    /** @deprecated */
    createChannel(name: string, type: 13, reason?: string, options?: CreateChannelOptions | string): Promise<StageChannel>;
    /** @deprecated */
    createChannel(name: string, type?: number, reason?: string, options?: CreateChannelOptions | string): Promise<unknown>;
    createEmoji(options: { image: string; name: string; roles?: string[] }, reason?: string): Promise<Emoji>;
    createRole(options: RoleOptions | Role, reason?: string): Promise<Role>;
    delete(): Promise<void>;
    deleteDiscoverySubcategory(categoryID: string, reason?: string): Promise<void>;
    deleteEmoji(emojiID: string, reason?: string): Promise<void>;
    deleteIntegration(integrationID: string): Promise<void>;
    deleteRole(roleID: string): Promise<void>;
    dynamicBannerURL(format?: ImageFormat, size?: number): string;
    dynamicDiscoverySplashURL(format?: ImageFormat, size?: number): string;
    dynamicIconURL(format?: ImageFormat, size?: number): string;
    dynamicSplashURL(format?: ImageFormat, size?: number): string;
    edit(options: GuildOptions, reason?: string): Promise<Guild>;
    editDiscovery(options?: DiscoveryOptions): Promise<DiscoveryMetadata>;
    editEmoji(emojiID: string, options: { name: string; roles?: string[] }, reason?: string): Promise<Emoji>;
    editIntegration(integrationID: string, options: IntegrationOptions): Promise<void>;
    editMember(memberID: string, options: MemberOptions, reason?: string): Promise<Member>;
    /** @deprecated */
    editNickname(nick: string): Promise<void>;
    editRole(roleID: string, options: RoleOptions): Promise<Role>;
    editVanity(code: string | null): Promise<GuildVanity>;
    editVoiceState(options: VoiceStateOptions, userID?: string): Promise<void>;
    editWelcomeScreen(options: WelcomeScreenOptions): Promise<WelcomeScreen>;
    editWidget(options: Widget): Promise<Widget>;
    fetchAllMembers(timeout?: number): Promise<number>;
    fetchMembers(options?: FetchMembersOptions): Promise<Member[]>;
    getActiveThreads(): Promise<ListedGuildThreads>;
    getAuditLog(options?: GetGuildAuditLogOptions): Promise<GuildAuditLog>;
    /** @deprecated */
    getAuditLogs(limit?: number, before?: string, actionType?: number, userID?: string): Promise<GuildAuditLog>;
    getBan(userID: string): Promise<{ reason?: string; user: User }>;
    getBans(): Promise<{ reason?: string; user: User }[]>;
    getDiscovery(): Promise<DiscoveryMetadata>;
    /** @deprecated */
    getEmbed(): Promise<Widget>;
    getPruneCount(options?: GetPruneOptions): Promise<number>;
    getRESTChannels(): Promise<AnyGuildChannel[]>;
    getRESTEmoji(emojiID: string): Promise<Emoji>;
    getRESTEmojis(): Promise<Emoji[]>;
    getRESTMember(memberID: string): Promise<Member>;
    getRESTMembers(options?: GetRESTGuildMembersOptions): Promise<Member[]>;
    /** @deprecated */
    getRESTMembers(limit?: number, after?: string): Promise<Member[]>;
    getRESTRoles(): Promise<Role[]>;
    getVanity(): Promise<GuildVanity>;
    getVoiceRegions(): Promise<VoiceRegion[]>;
    getWebhooks(): Promise<Webhook[]>;
    getWelcomeScreen(): Promise<WelcomeScreen>;
    getWidget(): Promise<WidgetData>;
    getWidgetSettings(): Promise<Widget>;
    kickMember(userID: string, reason?: string): Promise<void>;
    leave(): Promise<void>;
    leaveVoiceChannel(): void;
    permissionsOf(memberID: string | Member | MemberRoles): Permission;
    pruneMembers(options?: PruneMemberOptions): Promise<number>;
    removeMemberRole(memberID: string, roleID: string, reason?: string): Promise<void>;
    searchMembers(query: string, limit?: number): Promise<Member[]>;
    syncIntegration(integrationID: string): Promise<void>;
    unbanMember(userID: string, reason?: string): Promise<void>;
  }

  export class GuildAuditLogEntry extends Base {
    actionType: number;
    after: { [key: string]: unknown } | null;
    before: { [key: string]: unknown } | null;
    channel?: AnyGuildChannel;
    count?: number;
    deleteMemberDays?: number;
    guild: Guild;
    id: string;
    member?: Member | Uncached;
    membersRemoved?: number;
    message?: Message<GuildTextableChannel>;
    reason: string | null;
    role?: Role | { id: string; name: string };
    target?: Guild | AnyGuildChannel | Member | Role | Emoji | Message<GuildTextableChannel> | null;
    targetID: string;
    user: User;
    constructor(data: BaseData, guild: Guild);
  }

  export class GuildChannel extends Channel {
    guild: Guild;
    name: string;
    nsfw: boolean;
    parentID: string | null;
    permissionOverwrites: Collection<PermissionOverwrite>;
    position: number;
    type: Exclude<ChannelTypes, 1 | 3>;
    constructor(data: BaseData, client: Client);
    delete(reason?: string): Promise<void>;
    deletePermission(overwriteID: string, reason?: string): Promise<void>;
    edit(options: Omit<EditChannelOptions, "icon" | "ownerID">, reason?: string): Promise<this>;
    editPermission(
      overwriteID: string,
      allow: bigint | number,
      deny: bigint | number,
      type: PermissionType,
      reason?: string
    ): Promise<PermissionOverwrite>;
    editPosition(position: number, options?: EditChannelPositionOptions): Promise<void>;
    permissionsOf(memberID: string | Member | MemberRoles): Permission;
  }

  export class Member extends Base implements Presence {
    activities?: Activity[];
    avatar: string | null;
    avatarURL: string;
    bot: boolean;
    clientStatus?: ClientStatus;
    createdAt: number;
    defaultAvatar: string;
    defaultAvatarURL: string;
    discriminator: string;
    game: Activity | null;
    guild: Guild;
    id: string;
    joinedAt: number | null;
    mention: string;
    nick: string | null;
    pending?: boolean;
    /** @deprecated */
    permission: Permission;
    permissions: Permission;
    premiumSince: number;
    roles: string[];
    staticAvatarURL: string;
    status?: Status;
    user: User;
    username: string;
    voiceState: VoiceState;
    constructor(data: BaseData, guild?: Guild, client?: Client);
    addRole(roleID: string, reason?: string): Promise<void>;
    ban(deleteMessageDays?: number, reason?: string): Promise<void>;
    edit(options: MemberOptions, reason?: string): Promise<void>;
    kick(reason?: string): Promise<void>;
    removeRole(roleID: string, reason?: string): Promise<void>;
    unban(reason?: string): Promise<void>;
  }

  export class Message<T extends PossiblyUncachedTextable = TextableChannel> extends Base {
    activity?: MessageActivity;
    application?: MessageApplication;
    applicationID?: string;
    attachments: Attachment[];
    author: User;
    channel: T;
    channelMentions: string[];
    /** @deprecated */
    cleanContent: string;
    command?: Command;
    components?: ActionRow[];
    content: string;
    createdAt: number;
    editedTimestamp?: number;
    embeds: Embed[];
    flags: number;
    guildID: T extends GuildTextableWithThread ? string : undefined;
    id: string;
    interaction: MessageInteraction | null;
    jumpLink: string;
    member: T extends GuildTextableWithThread ? Member : null;
    mentionEveryone: boolean;
    mentions: User[];
    messageReference: MessageReference | null;
    pinned: boolean;
    prefix?: string;
    reactions: { [s: string]: { count: number; me: boolean } };
    referencedMessage?: Message | null;
    roleMentions: string[];
    stickerItems?: StickerItems[];
    /** @deprecated */
    stickers?: Sticker[];
    timestamp: number;
    tts: boolean;
    type: number;
    webhookID: T extends GuildTextableWithThread ? string | undefined : undefined;
    constructor(data: BaseData, client: Client);
    addReaction(reaction: string): Promise<void>;
    /** @deprecated */
    addReaction(reaction: string, userID: string): Promise<void>;
    createThreadWithMessage(messageID: string, options: CreateThreadOptions): Promise<NewsThreadChannel | PublicThreadChannel>;
    crosspost(): Promise<T extends NewsChannel ? Message<NewsChannel> : never>;
    delete(reason?: string): Promise<void>;
    deleteWebhook(token: string): Promise<void>;
    edit(content: MessageContent): Promise<Message<T>>;
    editWebhook(token: string, options: MessageWebhookContent): Promise<Message<T>>;
    getReaction(reaction: string, options?: GetMessageReactionOptions): Promise<User[]>;
    /** @deprecated */
    getReaction(reaction: string, limit?: number, before?: string, after?: string): Promise<User[]>;
    pin(): Promise<void>;
    removeReaction(reaction: string, userID?: string): Promise<void>;
    removeReactionEmoji(reaction: string): Promise<void>;
    removeReactions(): Promise<void>;
    unpin(): Promise<void>;
  }

  // News channel rate limit is always 0
  export class NewsChannel extends TextChannel {
    rateLimitPerUser: 0;
    type: 5;
    createMessage(content: MessageContent, file?: MessageFile | MessageFile[]): Promise<Message<NewsChannel>>;
    createThreadWithMessage(messageID: string, options: CreateThreadOptions): Promise<NewsThreadChannel>;
    crosspostMessage(messageID: string): Promise<Message<NewsChannel>>;
    editMessage(messageID: string, content: MessageContentEdit): Promise<Message<NewsChannel>>;
    follow(webhookChannelID: string): Promise<ChannelFollow>;
    getMessage(messageID: string): Promise<Message<NewsChannel>>;
    getMessages(options?: GetMessagesOptions): Promise<Message<NewsChannel>[]>;
    /** @deprecated */
    getMessages(limit?: number, before?: string, after?: string, around?: string): Promise<Message<NewsChannel>[]>;
    getPins(): Promise<Message<NewsChannel>[]>;
  }

  export class NewsThreadChannel extends ThreadChannel {
    type: 10;
    createMessage(content: MessageContent, file?: MessageFile | MessageFile[]): Promise<Message<NewsThreadChannel>>;
    edit(options: Pick<EditChannelOptions, "archived" | "autoArchiveDuration" | "locked" | "name" | "rateLimitPerUser">, reason?: string): Promise<this>;
    editMessage(messageID: string, content: MessageContentEdit): Promise<Message<NewsThreadChannel>>;
    getMessage(messageID: string): Promise<Message<NewsThreadChannel>>;
    getMessages(options?: GetMessagesOptions): Promise<Message<NewsThreadChannel>[]>;
    getPins(): Promise<Message<NewsThreadChannel>[]>;
  }

  export class Permission extends Base {
    allow: bigint;
    deny: bigint;
    json: Record<keyof Constants["Permissions"], boolean>;
    constructor(allow: number | string | bigint, deny?: number | string | bigint);
    has(permission: keyof Constants["Permissions"]): boolean;
  }

  export class PermissionOverwrite extends Permission {
    id: string;
    type: PermissionType;
    constructor(data: Overwrite);
  }

  export class Piper extends EventEmitter {
    converterCommand: ConverterCommand;
    dataPacketCount: number;
    encoding: boolean;
    libopus: boolean;
    opus: OpusScript | null;
    opusFactory: () => OpusScript;
    volumeLevel: number;
    constructor(converterCommand: string, opusFactory: OpusScript);
    addDataPacket(packet: unknown): void;
    encode(source: string | Stream, options: VoiceResourceOptions): boolean;
    getDataPacket(): Buffer;
    reset(): void;
    resetPackets(): void;
    setVolume(volume: number): void;
    stop(e: Error, source: Duplex): void;
  }

  export class PrivateChannel extends Channel implements Textable {
    lastMessageID: string;
    messages: Collection<Message<this>>;
    recipient: User;
    type: 1 | 3;
    addMessageReaction(messageID: string, reaction: string): Promise<void>;
    /** @deprecated */
    addMessageReaction(messageID: string, reaction: string, userID: string): Promise<void>;
    createMessage(content: MessageContent, file?: MessageFile | MessageFile[]): Promise<Message<PrivateChannel>>;
    deleteMessage(messageID: string, reason?: string): Promise<void>;
    editMessage(messageID: string, content: MessageContentEdit): Promise<Message<PrivateChannel>>;
    getMessage(messageID: string): Promise<Message<PrivateChannel>>;
    getMessageReaction(messageID: string, reaction: string, options?: GetMessageReactionOptions): Promise<User[]>;
    /** @deprecated */
    getMessageReaction(messageID: string, reaction: string, limit?: number, before?: string, after?: string): Promise<User[]>;
    getMessages(options?: GetMessagesOptions): Promise<Message<PrivateChannel>[]>;
    /** @deprecated */
    getMessages(limit?: number, before?: string, after?: string, around?: string): Promise<Message<PrivateChannel>[]>;
    getPins(): Promise<Message<PrivateChannel>[]>;
    leave(): Promise<void>;
    pinMessage(messageID: string): Promise<void>;
    removeMessageReaction(messageID: string, reaction: string): Promise<void>;
    /** @deprecated */
    removeMessageReaction(messageID: string, reaction: string, userID: string): Promise<void>;
    ring(recipient: string[]): void;
    sendTyping(): Promise<void>;
    syncCall(): void;
    unpinMessage(messageID: string): Promise<void>;
    unsendMessage(messageID: string): Promise<void>;
  }

  export class PrivateThreadChannel extends ThreadChannel {
    threadMetadata: PrivateThreadMetadata;
    type: 12;
    createMessage(content: MessageContent, file?: MessageFile | MessageFile[]): Promise<Message<PrivateThreadChannel>>;
    edit(options: Pick<EditChannelOptions, "archived" | "autoArchiveDuration" | "invitable" | "locked" | "name" | "rateLimitPerUser">, reason?: string): Promise<this>;
    editMessage(messageID: string, content: MessageContentEdit): Promise<Message<PrivateThreadChannel>>;
    getMessage(messageID: string): Promise<Message<PrivateThreadChannel>>;
    getMessages(options?: GetMessagesOptions): Promise<Message<PrivateThreadChannel>[]>;
    getPins(): Promise<Message<PrivateThreadChannel>[]>;
  }

  export class PublicThreadChannel extends ThreadChannel {
    type: 10 | 11;
    createMessage(content: MessageContent, file?: MessageFile | MessageFile[]): Promise<Message<PublicThreadChannel>>;
    edit(options: Pick<EditChannelOptions, "archived" | "autoArchiveDuration" | "locked" | "name" | "rateLimitPerUser">, reason?: string): Promise<this>;
    editMessage(messageID: string, content: MessageContentEdit): Promise<Message<PublicThreadChannel>>;
    getMessage(messageID: string): Promise<Message<PublicThreadChannel>>;
    getMessages(options?: GetMessagesOptions): Promise<Message<PublicThreadChannel>[]>;
    getPins(): Promise<Message<PublicThreadChannel>[]>;
  }

  export class RequestHandler implements SimpleJSON {
    globalBlock: boolean;
    latencyRef: LatencyRef;
    options: RequestHandlerOptions;
    ratelimits: { [route: string]: SequentialBucket };
    readyQueue: (() => void)[];
    userAgent: string;
    constructor(client: Client, options?: RequestHandlerOptions);
    /** @deprecated */
    constructor(client: Client, forceQueueing?: boolean);
    globalUnblock(): void;
    request(method: RequestMethod, url: string, auth?: boolean, body?: { [s: string]: unknown }, file?: MessageFile, _route?: string, short?: boolean): Promise<unknown>;
    routefy(url: string, method: RequestMethod): string;
    toString(): string;
    toJSON(props?: string[]): JSONCache;
  }

  export class Role extends Base {
    color: number;
    createdAt: number;
    guild: Guild;
    hoist: boolean;
    id: string;
    json: Partial<Record<Exclude<keyof Constants["Permissions"], "all" | "allGuild" | "allText" | "allVoice">, boolean>>;
    managed: boolean;
    mention: string;
    mentionable: boolean;
    name: string;
    permissions: Permission;
    position: number;
    tags?: RoleTags;
    constructor(data: BaseData, guild: Guild);
    delete(reason?: string): Promise<void>;
    edit(options: RoleOptions, reason?: string): Promise<Role>;
    editPosition(position: number): Promise<void>;
  }

  class SequentialBucket {
    latencyRef: LatencyRef;
    limit: number;
    processing: boolean;
    remaining: number;
    reset: number;
    constructor(limit: number, latencyRef?: LatencyRef);
    check(override?: boolean): void;
    queue(func: (cb: () => void) => void, short?: boolean): void;
  }

  export class Shard extends EventEmitter implements SimpleJSON {
    client: Client;
    connectAttempts: number;
    connecting: boolean;
    connectTimeout: NodeJS.Timeout | null;
    discordServerTrace?: string[];
    getAllUsersCount: { [guildID: string]: boolean };
    getAllUsersLength: number;
    getAllUsersQueue: string;
    globalBucket: Bucket;
    guildCreateTimeout: NodeJS.Timeout | null;
    guildSyncQueue: string[];
    guildSyncQueueLength: number;
    heartbeatInterval: NodeJS.Timeout | null;
    id: number;
    lastHeartbeatAck: boolean;
    lastHeartbeatReceived: number | null;
    lastHeartbeatSent: number | null;
    latency: number;
    preReady: boolean;
    presence: ClientPresence;
    presenceUpdateBucket: Bucket;
    ready: boolean;
    reconnectInterval: number;
    requestMembersPromise: { [s: string]: RequestMembersPromise };
    seq: number;
    sessionID: string | null;
    status: "disconnected" | "connecting" | "handshaking" | "ready" | "resuming";
    unsyncedGuilds: number;
    ws: WebSocket | BrowserWebSocket | null;
    constructor(id: number, client: Client);
    checkReady(): void;
    connect(): void;
    createGuild(_guild: Guild): Guild;
    disconnect(options?: { reconnect?: boolean | "auto" }, error?: Error): void;
    editAFK(afk: boolean): void;
    editStatus(status: Status, activities?: ActivityPartial<BotActivityType>[] | ActivityPartial<BotActivityType>): void;
    editStatus(activities?: ActivityPartial<BotActivityType>[] | ActivityPartial<BotActivityType>): void;
    // @ts-ignore: Method override
    emit(event: string, ...args: any[]): void;
    getGuildMembers(guildID: string, timeout: number): void;
    hardReset(): void;
    heartbeat(normal?: boolean): void;
    identify(): void;
    initializeWS(): void;
    onPacket(packet: RawPacket): void;
    requestGuildMembers(guildID: string, options?: RequestGuildMembersOptions): Promise<RequestGuildMembersReturn>;
    requestGuildSync(guildID: string): void;
    reset(): void;
    restartGuildCreateTimeout(): void;
    resume(): void;
    sendStatusUpdate(): void;
    sendWS(op: number, _data: Record<string, unknown>, priority?: boolean): void;
    syncGuild(guildID: string): void;
    wsEvent(packet: Required<RawPacket>): void;
    emit<K extends keyof ShardEvents>(event: K, ...args: ShardEvents[K]): boolean;
    emit(event: string, ...args: any[]): boolean;
    on<K extends keyof ShardEvents>(event: K, listener: (...args: ShardEvents[K]) => void): this;
    on(event: string, listener: (...args: any[]) => void): this;
    once<K extends keyof ShardEvents>(event: K, listener: (...args: ShardEvents[K]) => void): this;
    once(event: string, listener: (...args: any[]) => void): this;
    off<K extends keyof ShardEvents>(event: K, listener: (...args: ShardEvents[K]) => void): this;
    off(event: string, listener: (...args: any[]) => void): this;
    toJSON(props?: string[]): JSONCache;
  }

  export class ShardManager extends Collection<Shard> implements SimpleJSON {
    connectQueue: Shard[];
    connectTimeout: NodeJS.Timer | null;
    lastConnect: number;
    constructor(client: Client);
    connect(shard: Shard): void;
    spawn(id: number): void;
    tryConnect(): void;
    toString(): string;
    toJSON(props?: string[]): JSONCache;
  }

  export class SharedStream extends EventEmitter {
    bitrate: number;
    channels: number;
    current?: VoiceStreamCurrent;
    ended: boolean;
    frameDuration: number;
    piper: Piper;
    playing: boolean;
    samplingRate: number;
    speaking: boolean;
    voiceConnections: Collection<VoiceConnection>;
    volume: number;
    add(connection: VoiceConnection): void;
    play(resource: ReadableStream | string, options?: VoiceResourceOptions): void;
    remove(connection: VoiceConnection): void;
    setSpeaking(value: boolean): void;
    setVolume(volume: number): void;
    stopPlaying(): void;
    emit<K extends keyof StreamEvents>(event: K, ...args: StreamEvents[K]): boolean;
    emit(event: string, ...args: any[]): boolean;
    on<K extends keyof StreamEvents>(event: K, listener: (...args: StreamEvents[K]) => void): this;
    on(event: string, listener: (...args: any[]) => void): this;
    once<K extends keyof StreamEvents>(event: K, listener: (...args: StreamEvents[K]) => void): this;
    once(event: string, listener: (...args: any[]) => void): this;
    off<K extends keyof StreamEvents>(event: K, listener: (...args: StreamEvents[K]) => void): this;
    off(event: string, listener: (...args: any[]) => void): this;
  }

  export class StageChannel extends VoiceChannel {
    topic?: string;
    type: 13;
    createInstance(options: StageInstanceOptions): Promise<StageInstance>;
    deleteInstance(): Promise<void>;
    editInstance(options: StageInstanceOptions): Promise<StageInstance>;
    getInstance(): Promise<StageInstance>;
  }

  export class StageInstance extends Base {
    channel: StageChannel | Uncached;
    client: Client;
    discoverableDisabled: boolean;
    guild: Guild | Uncached;
    privacyLevel: StageInstancePrivacyLevel;
    topic: string;
    constructor(data: BaseData, client: Client);
    delete(): Promise<void>;
    edit(options: StageInstanceOptions): Promise<StageInstance>;
    update(data: BaseData): void;
  }

  export class StoreChannel extends GuildChannel {
    type: 6;
    edit(options: Omit<EditChannelOptions, "icon" | "ownerID">, reason?: string): Promise<this>;
  }

  export class TextChannel extends GuildChannel implements GuildTextable {
    defaultAutoArchiveDuration: AutoArchiveDuration;
    lastMessageID: string;
    lastPinTimestamp: number | null;
    messages: Collection<Message<this>>;
    rateLimitPerUser: number;
    topic: string | null;
    type: 0 | 5;
    constructor(data: BaseData, client: Client, messageLimit: number);
    addMessageReaction(messageID: string, reaction: string): Promise<void>;
    /** @deprecated */
    addMessageReaction(messageID: string, reaction: string, userID: string): Promise<void>;
    createMessage(content: MessageContent, file?: MessageFile | MessageFile[]): Promise<Message<TextChannel>>;
    createThreadWithMessage(messageID: string, options: CreateThreadOptions): Promise<PublicThreadChannel>;
    createThreadWithoutMessage(options: CreateThreadWithoutMessageOptions): Promise<PrivateThreadChannel>;
    createWebhook(options: { name: string; avatar?: string | null }, reason?: string): Promise<Webhook>;
    deleteMessage(messageID: string, reason?: string): Promise<void>;
    deleteMessages(messageIDs: string[], reason?: string): Promise<void>;
    edit(options: Omit<EditChannelOptions, "icon" | "ownerID">, reason?: string): Promise<this>;
    editMessage(messageID: string, content: MessageContentEdit): Promise<Message<TextChannel>>;
    /** @deprecated */
    getActiveThreads(): Promise<ListedChannelThreads>;
    getArchivedThreads(type: "private", options?: GetArchivedThreadsOptions): Promise<ListedChannelThreads<PrivateThreadChannel>>;
    getArchivedThreads(type: "public", options?: GetArchivedThreadsOptions): Promise<ListedChannelThreads<PublicThreadChannel>>;
    getJoinedPrivateArchivedThreads(options: GetArchivedThreadsOptions): Promise<ListedChannelThreads<PrivateThreadChannel>>;
    getMessage(messageID: string): Promise<Message<TextChannel>>;
    getMessageReaction(messageID: string, reaction: string, options?: GetMessageReactionOptions): Promise<User[]>;
    /** @deprecated */
    getMessageReaction(messageID: string, reaction: string, limit?: number, before?: string, after?: string): Promise<User[]>;
    getMessages(options?: GetMessagesOptions): Promise<Message<TextChannel>[]>;
    /** @deprecated */
    getMessages(limit?: number, before?: string, after?: string, around?: string): Promise<Message<TextChannel>[]>;
    getPins(): Promise<Message<TextChannel>[]>;
    getWebhooks(): Promise<Webhook[]>;
    pinMessage(messageID: string): Promise<void>;
    purge(options: PurgeChannelOptions): Promise<number>;
    /** @deprecated */
    purge(limit: number, filter?: (message: Message<this>) => boolean, before?: string, after?: string, reason?: string): Promise<number>;
    removeMessageReaction(messageID: string, reaction: string, userID?: string): Promise<void>;
    removeMessageReactionEmoji(messageID: string, reaction: string): Promise<void>;
    removeMessageReactions(messageID: string): Promise<void>;
    sendTyping(): Promise<void>;
    unpinMessage(messageID: string): Promise<void>;
    unsendMessage(messageID: string): Promise<void>;
  }

  type A<T extends TextableChannel> = T;
  type B = A<PublicThreadChannel>;

  export class ThreadChannel extends GuildChannel implements ThreadTextable {
    lastMessageID: string;
    lastPinTimestamp?: number;
    member?: ThreadMember;
    memberCount: number;
    members: Collection<ThreadMember>;
    messageCount: number;
    messages: Collection<Message<this>>;
    ownerID: string;
    rateLimitPerUser: number;
    threadMetadata: ThreadMetadata;
    type: 10 | 11 | 12;
    constructor(data: BaseData, client: Client, messageLimit?: number);
    addMessageReaction(messageID: string, reaction: string): Promise<void>;
    createMessage(content: MessageContent, file?: MessageFile | MessageFile[]): Promise<Message<ThreadChannel>>;
    deleteMessage(messageID: string, reason?: string): Promise<void>;
    deleteMessages(messageIDs: string[], reason?: string): Promise<void>;
    edit(options: Pick<EditChannelOptions, "archived" | "autoArchiveDuration" | "invitable" | "locked" | "name" | "rateLimitPerUser">, reason?: string): Promise<this>;
    editMessage(messageID: string, content: MessageContentEdit): Promise<Message<ThreadChannel>>;
    getMembers(): Promise<ThreadMember[]>;
    getMessage(messageID: string): Promise<Message<ThreadChannel>>;
    getMessageReaction(messageID: string, reaction: string, options?: GetMessageReactionOptions): Promise<User[]>;
    getMessages(options?: GetMessagesOptions): Promise<Message<ThreadChannel>[]>;
    getPins(): Promise<Message<ThreadChannel>[]>;
    join(userID?: string): Promise<void>;
    leave(userID?: string): Promise<void>;
    pinMessage(messageID: string): Promise<void>;
    purge(options: PurgeChannelOptions): Promise<number>;
    removeMessageReaction(messageID: string, reaction: string, userID?: string): Promise<void>;
    removeMessageReactionEmoji(messageID: string, reaction: string): Promise<void>;
    removeMessageReactions(messageID: string): Promise<void>;
    sendTyping(): Promise<void>;
    unpinMessage(messageID: string): Promise<void>;
    unsendMessage(messageID: string): Promise<void>;
  }

  export class ThreadMember extends Base {
    client: Client;
    joinTimestamp: number;
    threadID: string;
    constructor(data: BaseData, client: Client);
    leave(): Promise<void>;
    update(data: BaseData): void;
  }

  export class UnavailableGuild extends Base {
    createdAt: number;
    id: string;
    shard: Shard;
    unavailable: boolean;
    constructor(data: BaseData, client: Client);
  }

  export class User extends Base {
    avatar: string | null;
    avatarURL: string;
    bot: boolean;
    createdAt: number;
    defaultAvatar: string;
    defaultAvatarURL: string;
    discriminator: string;
    id: string;
    mention: string;
    publicFlags?: number;
    staticAvatarURL: string;
    system: boolean;
    username: string;
    constructor(data: BaseData, client: Client);
    deleteNote(): Promise<void>;
    dynamicAvatarURL(format?: ImageFormat, size?: number): string;
    editNote(note: string): Promise<void>;
    getDMChannel(): Promise<PrivateChannel>;
    getProfile(): Promise<UserProfile>;
  }

  export class VoiceChannel extends GuildChannel {
    bitrate: number;
    rtcRegion: string | null;
    type: 2 | 13;
    userLimit: number;
    videoQualityMode: VideoQualityMode;
    voiceMembers: Collection<Member>;
    join(options?: JoinVoiceChannelOptions): Promise<VoiceConnection>;
    leave(): void;
  }

  export class VoiceConnection extends EventEmitter implements SimpleJSON {
    bitrate: number;
    channelID: string | null;
    channels: number;
    connecting: boolean;
    connectionTimeout: NodeJS.Timeout | null;
    current?: VoiceStreamCurrent | null;
    ended?: boolean;
    endpoint: URL;
    frameDuration: number;
    frameSize: number;
    heartbeatInterval: NodeJS.Timeout | null;
    id: string;
    mode?: string;
    modes?: string;
    /** Optional dependencies OpusScript (opusscript) or OpusEncoder (@discordjs/opus) */
    opus: { [userID: string]: unknown };
    opusOnly: boolean;
    paused: boolean;
    pcmSize: number;
    piper: Piper;
    playing: boolean;
    ready: boolean;
    receiveStreamOpus?: VoiceDataStream | null;
    receiveStreamPCM?: VoiceDataStream | null;
    reconnecting: boolean;
    samplingRate: number;
    secret: Buffer;
    sendBuffer: Buffer;
    sendNonce: Buffer;
    sequence: number;
    shard: Shard | Record<string, never>;
    shared: boolean;
    speaking: boolean;
    ssrc?: number;
    ssrcUserMap: { [s: number]: string };
    timestamp: number;
    udpIP?: string;
    udpPort?: number;
    udpSocket: DgramSocket | null;
    volume: number;
    ws: BrowserWebSocket | WebSocket | null;
    constructor(id: string, options?: { shard?: Shard; shared?: boolean; opusOnly?: boolean });
    connect(data: VoiceConnectData): NodeJS.Timer | void;
    disconnect(error?: Error, reconnecting?: boolean): void;
    heartbeat(): void;
    pause(): void;
    play(resource: ReadableStream | string, options?: VoiceResourceOptions): void;
    receive(type: "opus" | "pcm"): VoiceDataStream;
    registerReceiveEventHandler(): void;
    resume(): void;
    sendWS(op: number, data: Record<string, unknown>): void;
    setSpeaking(value: boolean): void;
    setVolume(volume: number): void;
    stopPlaying(): void;
    switchChannel(channelID: string): void;
    updateVoiceState(selfMute: boolean, selfDeaf: boolean): void;
    emit<K extends keyof VoiceEvents>(event: K, ...args: VoiceEvents[K]): boolean;
    emit(event: string, ...args: any[]): boolean;
    on<K extends keyof VoiceEvents>(event: K, listener: (...args: VoiceEvents[K]) => void): this;
    on(event: string, listener: (...args: any[]) => void): this;
    once<K extends keyof VoiceEvents>(event: K, listener: (...args: VoiceEvents[K]) => void): this;
    once(event: string, listener: (...args: any[]) => void): this;
    off<K extends keyof VoiceEvents>(event: K, listener: (...args: VoiceEvents[K]) => void): this;
    off(event: string, listener: (...args: any[]) => void): this;
    toJSON(props?: string[]): JSONCache;
  }

  export class VoiceConnectionManager<T extends VoiceConnection = VoiceConnection> extends Collection<T> implements SimpleJSON {
    constructor(vcObject: new () => T);
    join(guildID: string, channelID: string, options: VoiceResourceOptions): Promise<VoiceConnection>;
    leave(guildID: string): void;
    switch(guildID: string, channelID: string): void;
    voiceServerUpdate(data: VoiceServerUpdateData): void;
    toJSON(props?: string[]): JSONCache;
  }

  export class VoiceDataStream extends EventEmitter {
    type: "opus" | "pcm";
    constructor(type: string);
    on(event: "data", listener: (data: Buffer, userID: string, timestamp: number, sequence: number) => void): this;
  }

  export class VoiceState extends Base {
    channelID: string | null;
    createdAt: number;
    deaf: boolean;
    id: string;
    mute: boolean;
    requestToSpeakTimestamp: number | null;
    selfDeaf: boolean;
    selfMute: boolean;
    selfStream: boolean;
    selfVideo: boolean;
    sessionID: string | null;
    suppress: boolean;
    constructor(data: BaseData);
  }
}

export = Eris;
