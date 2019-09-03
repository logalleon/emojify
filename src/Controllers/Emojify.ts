import { Request, Response } from "express";
import { SlackRequest, SlackResponse, MessageOptions, RowOutput } from '../interfaces';
import { pluck, weightedPluck, randomInt } from "ossuary/dist/lib/Random";
import config from '../config';
import characters from '../characters'
import _ from 'lodash';
import axios from 'axios';
import querystring from 'querystring';

const C = ':clear:';
const REG_QUOTES = /['"“”‘’„”«»].*?['"“”‘’„”«»]/g;
const CHARS_PER_ROW = 5;

class Emojify {

  constructor () {
    this.getHelp = this.getHelp.bind(this);
    this.emojify = this.emojify.bind(this);
  }

  parseRequest (text: string): MessageOptions {
    var has_illegal_characters = false;
    var emojis = text.match(/(\:[^ :]*\:(\:skin-tone-\d\:))|(\:[^ :]*\:)/gm);
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
    let rowBreaks: number[] = [];
    const words = text.split('%');
    let currentLine = "";
    let test: any = [];
    let splitLoc: number = 0;
    words.forEach((word) => {
      console.log(word);
      if (currentLine.length == 0) {
        currentLine = word;
      } else {
        currentLine += ' ' + word;
      }
      if (word == '\n' || currentLine.length >= CHARS_PER_ROW) {
        test.push(currentLine);
        currentLine = "";
      }
    });
    if (currentLine.length > 0) {
      test.push(currentLine);
    }
    for (let testIndex = 0; testIndex < test.length -1; testIndex++) {
      if (splitLoc == 0) {
        splitLoc = test[testIndex].length;
      } else {
        splitLoc += test[testIndex].length + 1;
      }
      rowBreaks.push(splitLoc)
    }
    console.log(test, rowBreaks);
    const letters = text.split('');

    let rows: RowOutput[] = [];

    let row1 = '';
    let row2 = '';
    let row3 = '';
    let row4 = '';
    let row5 = '';
    let index = 0;
    letters.forEach((letter, letterIndex) => {
      letter = letter.toUpperCase();
      let emojiNum = index % options.emojis.length;
      //only change on non-spaces
      if (letter !== '%') {
        index += 1;
      }
      if (rowBreaks.indexOf(letterIndex) > -1) {
        const newRow = {
          row1,
          row2,
          row3,
          row4,
          row5
        };
        row1= "";
        row2= "";
        row3 = "";
        row4 = "";
        row5 = "";
        rows.push(newRow);
      } else {
        if (characters[letter]) {
          row1 += characters[letter].row1.replace(/0/gi, 'emoji' + emojiNum.toString());
          row2 += characters[letter].row2.replace(/0/gi, 'emoji' + emojiNum.toString());
          row3 += characters[letter].row3.replace(/0/gi, 'emoji' + emojiNum.toString());
          row4 += characters[letter].row4.replace(/0/gi, 'emoji' + emojiNum.toString());
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
      }
    });
    const remainingRow = {
      row1,
      row2,
      row3,
      row4,
      row5
    };
    rows.push(remainingRow);
    let multiLines = "";
    for (let numRow = 0; numRow < rows.length; numRow++) {
      rows[numRow].row1 = rows[numRow].row1.replace(/\./g, C);
      rows[numRow].row2 = rows[numRow].row2.replace(/\./g, C);
      rows[numRow].row3 = rows[numRow].row3.replace(/\./g, C);
      rows[numRow].row4 = rows[numRow].row4.replace(/\./g, C);
      rows[numRow].row5 = rows[numRow].row5.replace(/\./g, C);
      for (let i = 0; i < options.emojis.length; i++) {
        let emojiRG = new RegExp('emoji' + i.toString(), "g");
        rows[numRow].row1 = rows[numRow].row1.replace(emojiRG, options.emojis[i]);
        rows[numRow].row2 = rows[numRow].row2.replace(emojiRG,  options.emojis[i]);
        rows[numRow].row3 = rows[numRow].row3.replace(emojiRG,  options.emojis[i]);
        rows[numRow].row4 = rows[numRow].row4.replace(emojiRG,  options.emojis[i]);
        rows[numRow].row5 = rows[numRow].row5.replace(emojiRG, options.emojis[i]);
      }
      multiLines += `${rows[numRow].row1}\n${rows[numRow].row2}\n${rows[numRow].row3}\n${rows[numRow].row4}\n${rows[numRow].row5}`;
      if (numRow < (rows.length -1)) {
        multiLines += '\n:clear:\n';
      }
    }

    return multiLines;
  }


  getHelp (): string {
    let str = 'EMOJIFY just (JUST) \`\/emojify the text you want :emoji:\`';
    str += '\nplz don\'t use anything other than supported characters, okay?';
    return str;
  }

  async auth (req: Request, res: Response) {

    const { query } = req;

    if (!query || !query.code) {
      return res.send('Error: no code present');
    }

    const body = {
      'client_id': config.CLIENT_ID,
      'client_secret': config.CLIENT_SECRET,
      'code': query.code,
      'redirect_uri': config.OAUTH_REDIRECT_URI
    }

    axios.post('https://slack.com/api/oauth.access', querystring.stringify(body))
      .then((response) => {
        config.OAUTH_REDIRECT_URI ? res.redirect(config.OAUTH_REDIRECT_URI) : res.sendStatus(200);
      })
      .catch((e) => {
        res.send('Error Authenticating OAUTH');
      });
  }

}

export default Emojify;
