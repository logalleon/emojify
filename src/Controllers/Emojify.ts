import { Request, Response } from "express";
import { SlackRequest, SlackResponse } from '../interfaces';
import { pluck, weightedPluck, randomInt } from "ossuary/dist/lib/Random";
import config from '../config';
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
    const isNonAlpha = options[0].replace(/ /g, '').match(/[^a-zA-Z%]/g);
    let response: SlackResponse;
    if (options[0].toLowerCase() === 'help') {
      response = {
        text: this.getHelp(),
        response_type: "ephemeral"
      };
    } else if (isNonAlpha) {
      response = {
        text: 'Emojify only supports alphabetic characters.',
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
      switch (letter) {
        case '%':
          row1 += '....';
          row2 += '....';
          row3 += '....';
          row4 += '....';
          row5 += '....';
          break;
        case 'A':
          row1 += '.00.';
          row2 += '0..0';
          row3 += '0000';
          row4 += '0..0';
          row5 += '0..0';
          break;
        case 'B':
          row1 += '000.';
          row2 += '0..0';
          row3 += '0000';
          row4 += '0..0';
          row5 += '000.';
          break;
        case 'C':
          row1 += '0000';
          row2 += '0...';
          row3 += '0...';
          row4 += '0...';
          row5 += '0000';
          break;
        case 'D':
          row1 += '000.';
          row2 += '0..0';
          row3 += '0..0';
          row4 += '0..0';
          row5 += '000.';
          break;
        case 'E':
          row1 += '0000';
          row2 += '0...';
          row3 += '000.';
          row4 += '0...';
          row5 += '0000';
          break;
        case 'F':
          row1 += '0000';
          row2 += '0...';
          row3 += '000.';
          row4 += '0...';
          row5 += '0...';
          break;
        case 'G':
          row1 += '0000';
          row2 += '0...';
          row3 += '0.00';
          row4 += '0..0';
          row5 += '0000';
          break;
        case 'H':
          row1 += '0..0';
          row2 += '0..0';
          row3 += '0000';
          row4 += '0..0';
          row5 += '0..0';
          break;
        case 'I':
          row1 += '0000';
          row2 += '.0..';
          row3 += '.0..';
          row4 += '.0..';
          row5 += '0000';
          break;
        case 'J':
          row1 += '...0';
          row2 += '...0';
          row3 += '...0';
          row4 += '0..0';
          row5 += '.00.';
          break;
        case 'K':
          row1 += '0..0';
          row2 += '0.0.';
          row3 += '00..';
          row4 += '0.0.';
          row5 += '0..0';
          break;
        case 'L':
          row1 += '0...';
          row2 += '0...';
          row3 += '0...';
          row4 += '0...';
          row5 += '0000';
          break;
        case 'M':
          row1 += '0..0';
          row2 += '000.';
          row3 += '00.0';
          row4 += '0..0';
          row5 += '0..0';
          break;
        case 'N':
          row1 += '0..0';
          row2 += '00.0';
          row3 += '0.00';
          row4 += '0..0';
          row5 += '0..0';
          break;
        case 'O':
          row1 += '0000';
          row2 += '0..0';
          row3 += '0..0';
          row4 += '0..0';
          row5 += '0000';
          break;
        case 'P':
          row1 += '0000';
          row2 += '0..0';
          row3 += '0000';
          row4 += '0...';
          row5 += '0...';
          break;
        case 'Q':
          row1 += '0000';
          row2 += '0..0';
          row3 += '0..0';
          row4 += '0.00';
          row5 += '0000';
          break;
        case 'R':
          row1 += '0000';
          row2 += '0..0';
          row3 += '0000';
          row4 += '0.0.';
          row5 += '0..0';
          break;
        case 'S':
          row1 += '0000';
          row2 += '0...';
          row3 += '0000';
          row4 += '...0';
          row5 += '0000';
          break;
        case 'T':
          row1 += '0000';
          row2 += '.0..';
          row3 += '.0..';
          row4 += '.0..';
          row5 += '.0..';
          break;
        case 'U':
          row1 += '0..0';
          row2 += '0..0';
          row3 += '0..0';
          row4 += '0..0';
          row5 += '0000';
          break;
        case 'V':
          row1 += '0..0';
          row2 += '0..0';
          row3 += '0..0';
          row4 += '0..0';
          row5 += '.00.';
          break;
        case 'W':
          row1 += '0..0';
          row2 += '0..0';
          row3 += '0.00';
          row4 += '.000';
          row5 += '.00.';
          break;
        case 'X':
          row1 += '0..0';
          row2 += '0..0';
          row3 += '.00.';
          row4 += '0..0';
          row5 += '0..0';
          break;
        case 'Y':
          row1 += '0..0';
          row2 += '0..0';
          row3 += '.00.';
          row4 += '.0..';
          row5 += '.0..';
          break;
        case 'Z':
          row1 += '0000';
          row2 += '...0';
          row3 += '0000';
          row4 += '0...';
          row5 += '0000';
          break;
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
    let str = 'EMOJIFY just (JUST) \`\/emojify name :emoji:\` or \`\/emojify "quoted stuff" :emoji:\`';
    str += '\nplz don\'t use anything other than alpha chars, okay?';
    return str;
  }

}

export default Emojify;
