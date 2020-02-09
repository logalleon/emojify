import { Head } from '../components/head';
import Link from 'next/link';

const Home = () => {
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
        <div
          style={{
            padding: '20px',
            background: 'wheat',
            maxWidth: '800px',
            boxShadow: '10px 10px #616126, 20px 20px #616126',
          }}
        >
          <Link href="/">
            <a>
              <img src="/suffering.jpg" />
            </a>
          </Link>
          <h1 style={{ color: 'deepskyblue' }}>Thanks for installing emojify.</h1>
          <p style={{ fontFamily: 'serif', fontSize: '48px' }}>
            🚨IMPORTANT🚨: Set <a href="/clear.png">THIS IMAGE</a> as a custom emoji in your team's Slack. Use the name{' '}
            <span style={{ backgroundColor: 'pink' }}>:clear:</span> otherwise it won't work!!!
          </p>
        </div>
      </div>
    </>
  );
};

export default Home;
