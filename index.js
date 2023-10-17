const TelegramBot = require('node-telegram-bot-api');
const token = '6081196761:AAHTUAfSnOG9PyLWh7kt46lZsnsbWY_IjiI';
const bot = new TelegramBot(token, {polling: true});
const fs = require("fs");
const YTDlpWrap = require('yt-dlp-wrap').default;
const ytDlpWrap = new YTDlpWrap('yt-dlp/yt-dlp.exe');
const express = require("express");
const app = express();


async function getMetaData(link){
  let metadata = await ytDlpWrap.getVideoInfo(
    'https://www.youtube.com/watch?v=aqz-KE-bpKQ'
);
console.log(metadata.title);
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
    .on('error', (error) => console.error(error))
    .on('close', () => bot.sendVideo(chatId, `${name1}.mp4`));

    console.log(ytDlpEventEmitter.ytDlpProcess.pid);  
    
    }
  });
