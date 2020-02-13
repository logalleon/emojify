import { NextApiRequest, NextApiResponse } from 'next';
import { WebClient } from '@slack/web-api';

import config from '../../lib/config';

const oAuth = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req;

  if (!query || !query.code) {
    return res.end('Error: no code present');
  }

  await new WebClient().oauth.v2.access({
    client_id: config.CLIENT_ID,
    client_secret: config.CLIENT_SECRET,
    code: query.code.toString(),
    redirect_uri: `${config.APP_URL}/api/oauth`,
  });

  return res.writeHead(302, { Location: `${config.APP_URL}/success` }).end();
};

export default oAuth;
