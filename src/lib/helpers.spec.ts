import { EMPTY_TEXT_MESSAGE, HELP_MESSAGE } from './constants';
import { handleSlackRequest, parseRequest } from './helpers';

test('can parse valid request', () => {
  const exampleString = 'dolla dolla mimault yall :thumbsup::skin-tone-1: :no:';
  expect(parseRequest(exampleString)).toMatchObject({
    text: 'dolla%dolla%mimault%yall',
    has_illegal_characters: false,
    emojis: [':thumbsup::skin-tone-1:', ':no:'],
  });
});

test('can flag invalid valid request', () => {
  const exampleString = 'dolla dolla mimault yall 🎉';
  expect(parseRequest(exampleString)).toMatchObject({
    text: 'dolla%dolla%mimault%yall%🎉',
    has_illegal_characters: true,
  });
});

test('handles help command', () => {
  expect(
    handleSlackRequest({
      text: 'help',
      emojis: [],
      has_illegal_characters: false,
    }),
  ).toMatchObject({
    response_type: 'ephemeral',
    text: HELP_MESSAGE,
  });
});

test('handles empty', () => {
  expect(
    handleSlackRequest({
      text: '',
      emojis: [],
      has_illegal_characters: false,
    }),
  ).toMatchObject({
    response_type: 'ephemeral',
    text: EMPTY_TEXT_MESSAGE,
  });
});

test('handles valid message', () => {
  const slackResponse = handleSlackRequest({
    text: 'dolla%dolla%mimault%yall',
    has_illegal_characters: false,
    emojis: [':thumbsup::skin-tone-1:', ':no:'],
  });
  expect(slackResponse).toMatchObject({
    text:
      ':thumbsup::skin-tone-1::thumbsup::skin-tone-1::thumbsup::skin-tone-1::clear::clear::no::no::no::no::clear::thumbsup::skin-tone-1::clear::clear::clear::no::clear::clear::clear::clear::thumbsup::skin-tone-1::thumbsup::skin-tone-1::clear::clear:\n' +
      ':thumbsup::skin-tone-1::clear::clear::thumbsup::skin-tone-1::clear::no::clear::clear::no::clear::thumbsup::skin-tone-1::clear::clear::clear::no::clear::clear::clear::thumbsup::skin-tone-1::clear::clear::thumbsup::skin-tone-1::clear:\n' +
      ':thumbsup::skin-tone-1::clear::clear::thumbsup::skin-tone-1::clear::no::clear::clear::no::clear::thumbsup::skin-tone-1::clear::clear::clear::no::clear::clear::clear::thumbsup::skin-tone-1::thumbsup::skin-tone-1::thumbsup::skin-tone-1::thumbsup::skin-tone-1::clear:\n' +
      ':thumbsup::skin-tone-1::clear::clear::thumbsup::skin-tone-1::clear::no::clear::clear::no::clear::thumbsup::skin-tone-1::clear::clear::clear::no::clear::clear::clear::thumbsup::skin-tone-1::clear::clear::thumbsup::skin-tone-1::clear:\n' +
      ':thumbsup::skin-tone-1::thumbsup::skin-tone-1::thumbsup::skin-tone-1::clear::clear::no::no::no::no::clear::thumbsup::skin-tone-1::thumbsup::skin-tone-1::thumbsup::skin-tone-1::clear::no::no::no::clear::thumbsup::skin-tone-1::clear::clear::thumbsup::skin-tone-1::clear:\n' +
      ':clear:\n' +
      ':no::no::no::clear::clear::thumbsup::skin-tone-1::thumbsup::skin-tone-1::thumbsup::skin-tone-1::thumbsup::skin-tone-1::clear::no::clear::clear::clear::thumbsup::skin-tone-1::clear::clear::clear::clear::no::no::clear::clear:\n' +
      ':no::clear::clear::no::clear::thumbsup::skin-tone-1::clear::clear::thumbsup::skin-tone-1::clear::no::clear::clear::clear::thumbsup::skin-tone-1::clear::clear::clear::no::clear::clear::no::clear:\n' +
      ':no::clear::clear::no::clear::thumbsup::skin-tone-1::clear::clear::thumbsup::skin-tone-1::clear::no::clear::clear::clear::thumbsup::skin-tone-1::clear::clear::clear::no::no::no::no::clear:\n' +
      ':no::clear::clear::no::clear::thumbsup::skin-tone-1::clear::clear::thumbsup::skin-tone-1::clear::no::clear::clear::clear::thumbsup::skin-tone-1::clear::clear::clear::no::clear::clear::no::clear:\n' +
      ':no::no::no::clear::clear::thumbsup::skin-tone-1::thumbsup::skin-tone-1::thumbsup::skin-tone-1::thumbsup::skin-tone-1::clear::no::no::no::clear::thumbsup::skin-tone-1::thumbsup::skin-tone-1::thumbsup::skin-tone-1::clear::no::clear::clear::no::clear:\n' +
      ':clear:\n' +
      ':clear::thumbsup::skin-tone-1::clear::thumbsup::skin-tone-1::clear::clear::no::no::no::clear::clear::thumbsup::skin-tone-1::clear::thumbsup::skin-tone-1::clear::clear::clear::no::no::clear::clear::thumbsup::skin-tone-1::clear::clear::thumbsup::skin-tone-1::clear::no::clear::clear::clear::thumbsup::skin-tone-1::thumbsup::skin-tone-1::thumbsup::skin-tone-1::thumbsup::skin-tone-1::clear:\n' +
      ':thumbsup::skin-tone-1::clear::thumbsup::skin-tone-1::clear::thumbsup::skin-tone-1::clear::clear::no::clear::clear::thumbsup::skin-tone-1::clear::thumbsup::skin-tone-1::clear::thumbsup::skin-tone-1::clear::no::clear::clear::no::clear::thumbsup::skin-tone-1::clear::clear::thumbsup::skin-tone-1::clear::no::clear::clear::clear::clear::thumbsup::skin-tone-1::clear::clear::clear:\n' +
      ':thumbsup::skin-tone-1::clear::clear::clear::thumbsup::skin-tone-1::clear::clear::no::clear::clear::thumbsup::skin-tone-1::clear::clear::clear::thumbsup::skin-tone-1::clear::no::no::no::no::clear::thumbsup::skin-tone-1::clear::clear::thumbsup::skin-tone-1::clear::no::clear::clear::clear::clear::thumbsup::skin-tone-1::clear::clear::clear:\n' +
      ':thumbsup::skin-tone-1::clear::clear::clear::thumbsup::skin-tone-1::clear::clear::no::clear::clear::thumbsup::skin-tone-1::clear::clear::clear::thumbsup::skin-tone-1::clear::no::clear::clear::no::clear::thumbsup::skin-tone-1::clear::clear::thumbsup::skin-tone-1::clear::no::clear::clear::clear::clear::thumbsup::skin-tone-1::clear::clear::clear:\n' +
      ':thumbsup::skin-tone-1::clear::clear::clear::thumbsup::skin-tone-1::clear::no::no::no::clear::thumbsup::skin-tone-1::clear::clear::clear::thumbsup::skin-tone-1::clear::no::clear::clear::no::clear::thumbsup::skin-tone-1::thumbsup::skin-tone-1::thumbsup::skin-tone-1::thumbsup::skin-tone-1::clear::no::no::no::clear::clear::thumbsup::skin-tone-1::clear::clear::clear:\n' +
      ':clear:\n' +
      ':no::clear::clear::no::clear::clear::thumbsup::skin-tone-1::thumbsup::skin-tone-1::clear::clear::no::clear::clear::clear::thumbsup::skin-tone-1::clear::clear::clear:\n' +
      ':no::clear::clear::no::clear::thumbsup::skin-tone-1::clear::clear::thumbsup::skin-tone-1::clear::no::clear::clear::clear::thumbsup::skin-tone-1::clear::clear::clear:\n' +
      ':clear::no::no::clear::clear::thumbsup::skin-tone-1::thumbsup::skin-tone-1::thumbsup::skin-tone-1::thumbsup::skin-tone-1::clear::no::clear::clear::clear::thumbsup::skin-tone-1::clear::clear::clear:\n' +
      ':clear::no::clear::clear::clear::thumbsup::skin-tone-1::clear::clear::thumbsup::skin-tone-1::clear::no::clear::clear::clear::thumbsup::skin-tone-1::clear::clear::clear:\n' +
      ':clear::no::clear::clear::clear::thumbsup::skin-tone-1::clear::clear::thumbsup::skin-tone-1::clear::no::no::no::clear::thumbsup::skin-tone-1::thumbsup::skin-tone-1::thumbsup::skin-tone-1::clear:',
    response_type: 'in_channel',
  });
});
