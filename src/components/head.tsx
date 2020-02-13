import NextHead from 'next/head';

export const Head = ({ title }: { title: string }) => (
  <NextHead>
    <title>Emojify</title>
    <link href="https://fonts.googleapis.com/css?family=Homemade+Apple&display=swap" rel="stylesheet" />
  </NextHead>
);
