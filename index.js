var TelegramBot = require('node-telegram-bot-api');
var rp = require('request-promise');

var token = '809267466:AAEvKpXwESa4J_FUAgr1C0DDlbcyI00Etc4';
var bot = new TelegramBot(token, {polling: true});


const apiKey = '17c28f8884732158d5ea168aae529777'
const oauthToken = 'd7933ad7bb8cf802f9b8ebba231f6b9776c611492ec1a708627ecc2cff525723'
const trelloNode = require('trello-node-api')(apiKey, oauthToken);
const boardToDo = '5cbdd61ae43e0f56d08b4654'

function createCard(params) {
  let data = {
       name: 'CARD_NAME',
       desc: 'Card description',
       pos: 'top',
       idList: '',
       due: null,
       // dueComplete: false,
       // idMembers: ['MEMBER_ID', 'MEMBER_ID', 'MEMBER_ID'],
       // idLabels: ['LABEL_ID', 'LABEL_ID', 'LABEL_ID'],
       // urlSource: 'https://example.com',
       //fileSource: 'file',
       //idCardSource: 'CARD_ID',
       // keepFromSource: 'attachments,checklists,comments,due,labels,members,stickers'
   };
   let response;
   return trelloNode.card.create(Object.assign(data, params))
   .catch(console.log)
}
function telegramImgUrl(file_id) {
  const options = {
    uri: `https://api.telegram.org/bot${token}/getFile?file_id=${file_id}`,
    json: true,
  };
  return rp(options).then(({result}) => {
    const path = result.file_path || ''
    result.url = `https://api.telegram.org/file/bot${token}/${path}`
    return result
  }).catch(console.log)
}

bot.onText(/echo (.+)/, function (msg, match) {
    var fromId = msg.from.id;
    var resp = match[1];
    bot.sendMessage(fromId, resp);
});

bot.on('message', function (msg) {
    var chatId = msg.chat.id;
    let from = msg.from
    let [small_img, mid_img, origin_img] = msg.photo
    rp({
      uri: `https://api.telegram.org/bot${token}/getUpdates`,
      json: true,
    })
    .then(({result}) => Promise.all(result.map(r => telegramImgUrl((r.message.photo || []).pop().file_id))))
    .then(res => {
        createCard({
          name: from.first_name + ' ' + from.last_name,
          idList: boardToDo,
          desc: res.map(p => p.url).join('\n'),
        })
      })
    .catch(console.log)
});
