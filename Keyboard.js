const { Markup } = require('telegraf');

function sendOptionsKeyboard(ctx) {
    ctx.reply('Виберіть опцію:', Markup.keyboard([
        ['Замовлення'],
        ['Відгуки', 'Видалити відгук'],
      ])
      .oneTime()
      .resize());
}

// function sendOptionsKeyboard(ctx) {
//     ctx.reply('Виберіть опцію:', Markup.keyboard([
//         ['Відгуки', 'Замовлення'],
//         ['Видалити відгук', 'Видалити елемент з меню'],
//       ])
//       .oneTime()
//       .resize());
// }

module.exports = {
    sendOptionsKeyboard
};