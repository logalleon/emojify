type TeamDomain = '352inc';
type Command = '/emojify';
type ResponseType = 'in_channel' | 'ephemeral';

export interface SlackRequest {
  token: string;
  team_id: string;
  team_domain: TeamDomain;
  channel_id: string;
  channel_name: string;
  user_id: string;
  user_name: string;
  command: Command;
  text: string;
  response_url: string;
  trigger_id: string;
}

export interface Attachment {
  text: string;
}

export interface SlackResponse {
  response_type: ResponseType;
  text: string;
  attachments?: Attachment[];
}

export interface MessageOptions {
  text: string;
  has_illegal_characters: boolean;
  emojis: string[];
}

export interface RowOutput {
  row1: string;
  row2: string;
  row3: string;
  row4: string;
  row5: string;
}
