type TeamDomain = '352inc';
type Command = '/emojify';
type ResponseType = 'in_channel' | 'ephemeral';

interface SlackRequest {
  token: string,
  team_id: string,
  team_domain: TeamDomain,
  channel_id: string,
  channel_name: string,
  user_id: string,
  user_name: string,
  command: Command,
  text: string,
  response_url: string,
  trigger_id: string,
}

interface Attachment {
  text: string
}

interface SlackResponse {
  response_type: ResponseType,
  text: string,
  attachments?: Attachment[]
}

interface MessageOptions {
  text: string,
  has_illegal_characters: boolean,
  emojis: string[]
}
export { SlackRequest, Attachment, SlackResponse, MessageOptions }