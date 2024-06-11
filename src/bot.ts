import TelegramBot = require("node-telegram-bot-api")
import { WebClient } from '@slack/web-api';
import * as dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const telegramBot = new TelegramBot(<string>process.env.TELEGRAM_BOT_TOKEN, {
  polling: true,
});

const webSlack = new WebClient(process.env.SLACK_BOT_TOKEN);

console.log("yeah");

telegramBot.on('message', async (msg:any) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    console.log(msg);
    const userId = msg.from.id;

    if (text != undefined) {
      try {
        const response = await axios.get(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getUserProfilePhotos?user_id=${userId}`);
        const photoId = response.data.result.photos[0][0].file_id;
        const photoInfo = await telegramBot.getFile(photoId);
        const photoUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${photoInfo.file_path}`;

        console.log(response.data.result.photos[0][0].file_id);
        console.log(photoUrl);

        await webSlack.chat.postMessage({
          username: `${msg.from.first_name} ${msg.from.last_name} @${msg.from.username} (Telegram)`,
          icon_url:photoUrl,
          channel: <string>process.env.SLACK_CHANNEL_ID,
          text: text,
        });
      } catch (err) {
        console.error(err);
      }
    }
  });