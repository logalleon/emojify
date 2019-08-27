import { Request, Response } from "express";
import { SlackRequest, SlackResponse, MessageOptions } from '../interfaces';
import { pluck, weightedPluck, randomInt } from "ossuary/dist/lib/Random";
import config from '../config';
import characters from '../characters'
import _ from 'lodash';
import axios from 'axios';

const C = ':clear:';
const REG_QUOTES = /['"“”‘’„”«»].*?['"“”‘’„”«»]/g;

class Emojify {

  constructor () {
    this.getHelp = this.getHelp.bind(this);
    this.emojify = this.emojify.bind(this);
  }

  parseRequest (text: string): MessageOptions {
    var has_illegal_characters = false;
    var emojis = text.match(/(\:[^ :]*\:)/gm);
    var messsageText = text.replace(/(\:[^ ]*\:)/gm, '').replace(/  /gm, ' ').trim().replace(/ /gm, '%');
    var available_characters = Object.keys(characters);
    const REGEX_SPECIAL_CHARS = ['.', '\\', '+', '*', '?', '[', '^', ']', '$', '(', ')', '{', '}', '=', '!', '<', '>', '|', ':', '-'];
    available_characters.forEach((o, index) => {
      if (REGEX_SPECIAL_CHARS.indexOf(o) > -1) {
        available_characters[index] = "\\" + o;
      }
    });
    const reg = new RegExp(`[^${available_characters.join('')}]`, 'gi');
    const invalidCharacters = messsageText.replace(/ /g, '').match(reg);
    if (invalidCharacters) {
      has_illegal_characters = true;
    }
    return {
      text: messsageText,
      has_illegal_characters: has_illegal_characters,
      emojis: emojis ? emojis : []
    };
  }

  process (text: string): SlackResponse {
    const options = this.parseRequest(text);
    let response: SlackResponse;
    if (options.text.toLowerCase() === 'help' && options.emojis.length == 0) {
      response = {
        text: this.getHelp(),
        response_type: "ephemeral"
      };
    } else if (options.has_illegal_characters) { // Need a better way of checking these
      response = {
        text: `Emojify only supports these characters: ${Object.keys(characters)}.\nContribute characters to the project if you'd like more!`,
        response_type: "ephemeral"
      }
    } else if (options.emojis.length == 0) {
      response = {
        text: `Looks like you forgot to include an emoji, friendo.`,
        response_type: "ephemeral"
      };
    } else {
      response = {
        text: this.emojify(options),
        response_type: "in_channel"
      };
    }
    return response;
  }
  /**
   * This does all the route handling and magic stuff happens
   * @param req 
   * @param res 
   */
  async handle (req: Request, res: Response): Promise<void> {
    const body: SlackRequest = req.body;
    // String all string-quoted
    let { text } = body;
    let response = this.process(text);
    res.json(response);
  }

  emojify (options: {text: string, emojis: string[]}): string {
    var text = options.text;
    const letters = text.split('');
    let row1 = '';
    let row2 = '';
    let row3 = '';
    let row4 = '';
    let row5 = '';
    let index = 0;
    letters.forEach((letter) => {
      letter = letter.toUpperCase();
      let emojiNum = index % options.emojis.length;
      //only change on non-spaces
      if (letter !== '%') {
        index += 1;
      }
      // @ts-ignore
      if (characters[letter]) {
        // @ts-ignore
        row1 += characters[letter].row1.replace(/0/gi, 'emoji' + emojiNum.toString());
        // @ts-ignore
        row2 += characters[letter].row2.replace(/0/gi, 'emoji' + emojiNum.toString());
        // @ts-ignore
        row3 += characters[letter].row3.replace(/0/gi, 'emoji' + emojiNum.toString());
        // @ts-ignore
        row4 += characters[letter].row4.replace(/0/gi, 'emoji' + emojiNum.toString());
        // @ts-ignore
        row5 += characters[letter].row5.replace(/0/gi, 'emoji' + emojiNum.toString());
      // Unsupported
      } else {
        row1 += '00000'.replace(/0/gi, 'emoji' + emojiNum.toString());
        row2 += '00000'.replace(/0/gi,'emoji' + emojiNum.toString());
        row3 += '00000'.replace(/0/gi, 'emoji' + emojiNum.toString());
        row4 += '00000'.replace(/0/gi, 'emoji' + emojiNum.toString());
        row5 += '00000'.replace(/0/gi, 'emoji' + emojiNum.toString());
      }
      // Spacing
      row1 += '.';
      row2 += '.';
      row3 += '.';
      row4 += '.';
      row5 += '.';
    });
    row1 = row1.replace(/\./g, C);
    row2 = row2.replace(/\./g, C);
    row3 = row3.replace(/\./g, C);
    row4 = row4.replace(/\./g, C);
    row5 = row5.replace(/\./g, C);
    for (let i = 0; i < options.emojis.length; i++) {
      let emojiRG = new RegExp('emoji' + i.toString(), "g");
      row1 = row1.replace(emojiRG, options.emojis[i]);
      row2 = row2.replace(emojiRG,  options.emojis[i]);
      row3 = row3.replace(emojiRG,  options.emojis[i]);
      row4 = row4.replace(emojiRG,  options.emojis[i]);
      row5 = row5.replace(emojiRG, options.emojis[i]);
    }
    return `${row1}\n${row2}\n${row3}\n${row4}\n${row5}`;
  }


  getHelp (): string {
    let str = 'EMOJIFY just (JUST) \`\/emojify the text you want :emoji:\`';
    str += '\nplz don\'t use anything other than supported characters, okay?';
    return str;
  }

  async auth (req: Request, res: Response) {

    const { query } = req;

    if (!query || !query.code) {
      throw new Error('no-code');
    }

    // @ts-ignore
    const body = new URLSearchParams();
    body.append('client_id', config.CLIENT_ID);
    body.append('client_secret', config.CLIENT_SECRET);
    body.append('code', query.code);
    body.append('redirect_uri', config.OAUTH_REDIRECT_URI);

    axios.post('https://slack.com/api/oauth.access', body)
      .then((response) => {
        config.OAUTH_REDIRECT_URI ? res.redirect(config.OAUTH_REDIRECT_URI) : res.sendStatus(200);
      })
      .catch((e) => {
        res.sendStatus(401);
      });
  }

}

export default Emojify;
