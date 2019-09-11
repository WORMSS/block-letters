import mailer from 'nodemailer';

const transport = mailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'wormssmail',
    pass: process.env.GPASS,
  },
});

export async function sendMailWord(word: string) {
  console.log(`sending email ${word}`);
  const lenWord: number = word.length;
  const response = await transport.sendMail({
    from: {
      address: 'wormssmail@gmail.com',
      name: 'Colin Richardson',
    },
    sender: {
      address: 'wormssmail@gmail.com',
      name: 'Colin Richardson',
    },
    to: {
      address: 'wormssmail@gmail.com',
      name: 'Colin Richardson',
    },
    subject: `Block Letters ${lenWord} word`,
    text: `Found a ${lenWord} letter word ${word}`,
  });
  console.log('response', response);
}
