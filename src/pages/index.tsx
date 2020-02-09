import { useEffect, useState } from 'react';
import uEmojiParser from 'universal-emoji-parser';

import { Head } from '../components/head';
import config from '../lib/config';
import { emojifyText } from '../lib/helpers';

const Home = () => {
  const [emojified, setEmojified] = useState('');
  const [example, setExample] = useState('emojify');
  useEffect(() => {
    const parsed: string = uEmojiParser
      .parse(
        emojifyText({
          text: example,
          emojis: [':fire:'],
        }),
      )
      .replace(/:clear:/g, '<img src="/clear.png" />');
    setEmojified(parsed);
  }, [example]);
  const onInputChange = event => setExample(event.target.value);
  return (
    <>
      <Head title="Emojify" />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <div style={{ padding: '20px', background: 'wheat', boxShadow: '10px 10px #616126, 20px 20px #616126' }}>
          <img src="/suffering.jpg" />
          <h1 style={{ color: 'deepskyblue' }}>Emojify ~ Annoy your coworkers today!</h1>
          <a
            href={`https://slack.com/oauth/v2/authorize?client_id=${config.CLIENT_ID}&scope=commands&redirect_uri=${config.APP_URL}/api/oauth`}
          >
            <img
              alt="Add to Slack"
              height="40"
              width="139"
              src="https://platform.slack-edge.com/img/add_to_slack.png"
              srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
            />
          </a>
          <hr />
          <input type="text" value={example} onChange={onInputChange} />
          <div className="example" dangerouslySetInnerHTML={{ __html: emojified }} />
        </div>
      </div>
    </>
  );
};

export default Home;
