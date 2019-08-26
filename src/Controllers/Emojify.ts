import { Request, Response } from "express";
import { SlackRequest, SlackResponse } from '../interfaces';
import { pluck, weightedPluck, randomInt } from "ossuary/dist/lib/Random";
import config from '../config';
import characters from '../characters'
import _ from 'lodash';

const C = ':clear:';
const REG_QUOTES = /['"“”‘’„”«»].*?['"“”‘’„”«»]/g;

class Emojify {

  constructor () {
    this.getHelp = this.getHelp.bind(this);
    this.emojify = this.emojify.bind(this);
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
    if (text.match(REG_QUOTES)) {
      const matches: any = text.match(REG_QUOTES);
      matches.forEach((match: string) => {
        text = text.replace(match, match.replace(/ /g, '%'))
      });
    }
    text = text.replace(/['"“”‘’„”«»]/g, '');
    const options = text.split(' ');
    const reg = new RegExp(`[^${Object.keys(characters).join('')}]`, 'gi');
    const invalidCharacters = options[0].replace(/ /g, '').match(reg);
    let response: SlackResponse;
    if (options[0].toLowerCase() === 'help') {
      response = {
        text: this.getHelp(),
        response_type: "ephemeral"
      };
    } else if (invalidCharacters) {
      response = {
        text: `Emojify only supports these characters: ${Object.keys(characters)}.\nContribute characters to the project if you'd like more!`,
        response_type: "ephemeral"
      }
    } else if (!options[1]) {
      response = {
        text: `Looks like you forgot to include an emoji, friendo.`,
        response_type: "ephemeral"
      }
    } else {
      response = {
        text: this.emojify(options),
        response_type: "in_channel"
      };
    }
    res.json(response);
  }

  emojify (options: string[]): string {
    const [text, emoji] = options;
    const letters = text.split('');
    let row1 = '';
    let row2 = '';
    let row3 = '';
    let row4 = '';
    let row5 = '';
    letters.forEach((letter) => {
      letter = letter.toUpperCase();
      // @ts-ignore
      if (characters[letter]) {
        // @ts-ignore
        row1 += characters[letter].row1;
        // @ts-ignore
        row2 += characters[letter].row2;
        // @ts-ignore
        row3 += characters[letter].row3;
        // @ts-ignore
        row4 += characters[letter].row4;
        // @ts-ignore
        row5 += characters[letter].row5;
      // Unsupported
      } else {
        row1 += '00000';
        row2 += '00000';
        row3 += '00000';
        row4 += '00000';
        row5 += '00000';
      }
      // Spacing
      row1 += '.';
      row2 += '.';
      row3 += '.';
      row4 += '.';
      row5 += '.';
    });
    row1 = row1.replace(/\./g, C).replace(/0/g, emoji);
    row2 = row2.replace(/\./g, C).replace(/0/g, emoji);
    row3 = row3.replace(/\./g, C).replace(/0/g, emoji);
    row4 = row4.replace(/\./g, C).replace(/0/g, emoji);
    row5 = row5.replace(/\./g, C).replace(/0/g, emoji);
    return `${row1}\n${row2}\n${row3}\n${row4}\n${row5}`;
  }


  getHelp (): string {
    let str = 'EMOJIFY just (JUST) \`\/knifefight name :emoji:\` or \`\/knifefight "quoted stuff" :emoji:\`';
    str += '\nplz don\'t use anything other than support characters, okay?';
    return str;
  }

}

export default Emojify;
