import Eris from "./index.js";

export default function(token, options) {
  return new Eris.Client(token, options);
}

export const {
  Base,
  Bucket,
  CategoryChannel,
  Channel,
  Client,
  Collection,
  Command,
  CommandClient,
  Constants,
  DiscordHTTPError,
  DiscordRESTError,
  ExtendedUser,
  Guild,
  GuildChannel,
  Member,
  Message,
  NewsChannel,
  NewsThreadChannel,
  Permission,
  PermissionOverwrite,
  PrivateChannel,
  PrivateThreadChannel,
  PublicThreadChannel,
  RequestHandler,
  Role,
  SequentialBucket,
  Shard,
  SharedStream,
  StageChannel,
  StageInstance,
  StoreChannel,
  TextChannel,
  ThreadChannel,
  ThreadMember,
  UnavailableGuild,
  User,
  VERSION,
  VoiceChannel,
  VoiceConnection,
  VoiceConnectionManager,
  VoiceState
} = Eris;
