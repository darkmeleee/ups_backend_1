require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TOKEN;
console.log(token);
const bot = new TelegramBot(token, {polling: true});
const fs = require("fs");
const YTDlpWrap = require('yt-dlp-wrap').default;
const ytDlpWrap = new YTDlpWrap('yt-dlp/yt-dlp.exe'); // 
const express = require("express");
const app = express();


/*async function getMetaData(link){
  let metadata = await ytDlpWrap.getVideoInfo(
    'https://www.youtube.com/watch?v=aqz-KE-bpKQ'
);
console.log(metadata.title);
}*/ 

function onerr(bot,chatId){
  bot.sendMessage(chatId, "К сожалению, из-за ограничений телеграмма бот не может отправить видео, которые весят выше 50 мб. Приносим прощения за неудобства.")
}

bot.on('message', (msg) => {
    const name1 = Date.now();
    const chatId = msg.chat.id;
    if(msg.text == "/start"){
      bot.sendMessage(chatId, "Добро пожаловать в бота для скачивания видео. \nОтправьте ссылку на видео для того чтобы его скачать.");
    }
    else if(msg.text.includes("dzen.ru")){
      bot.sendMessage(chatId, "В настоящий момент загрузка видео с Яндекс Дзена не представляется возможной из-за проблем самого сайта.");
    }
    else{
      
      let ytDlpEventEmitter = ytDlpWrap
    .exec([
        msg.text,
        '-f',
        'best',
        '-o',
        `${name1}.mp4`,
    ])
    .on('progress', (progress) =>
        console.log(
            progress.percent,
            progress.totalSize,
            progress.currentSpeed,
            progress.eta
        )
    )
    .on('ytDlpEvent', (eventType, eventData) =>
        console.log(eventType, eventData)
    ) 
    .on('error', (error) => onerr(bot, chatId))
    .on('close', () => bot.sendVideo(chatId, `${name1}.mp4`));

    console.log(ytDlpEventEmitter.ytDlpProcess.pid);  
    
    }
  });
