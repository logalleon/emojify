import { NextApiRequest, NextApiResponse } from 'next';
import { handleSlackRequest, parseRequest } from '../../lib/helpers';
import { SlackRequest } from '../../lib/interfaces';

const slashCommand = (req: NextApiRequest, res: NextApiResponse) => {
  const body: SlackRequest = req.body;
  const parsedRequest = parseRequest(body.text);
  return res.json(handleSlackRequest(parsedRequest));
};

export default slashCommand;
