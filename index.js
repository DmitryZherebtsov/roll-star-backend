require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Telegraf } = require('telegraf');

const { sendOptionsKeyboard } = require('./Keyboard');
const { handleFeedbacks, handleAddReview, handleRejectReview, addReviews, confirmedReviews } = require('./Feedbacks');
const { handleDeleteFromReviews, handleFeedbackElements } = require('./DeleteFeedback');
const { addOrder, handleOrders } = require('./Orders');

const token = process.env.BOT_TOKEN;
const bot = new Telegraf(token);

const app = express();
const port = process.env.PORT;
const allowedUsers = [786187640, 987654321, 1027031193];
const chatIds = new Set();

app.use(cors());
app.use(bodyParser.json());

const checkUserPermission = (ctx, next) => {
    const userId = ctx.from.id;
    if (allowedUsers.includes(userId)) {
        return next();
    } else {
        ctx.reply('У вас немає доступу до цього бота.');
        console.log(`${userId} непройшов перевірку!`);
    }
};

function addChatId(ctx) {
    const chatId = ctx.chat.id;
    chatIds.add(chatId);
    console.log(chatIds)
}

function sendNotification() {
    const message = 'У вас нове замовлення!';
    chatIds.forEach(chatId => {
        bot.telegram.sendMessage(chatId, message)
            .then(response => {
                console.log(`Повідомлення відправлено до chatId: ${chatId}`, response);
            })
            .catch(error => {
                console.error(`Помилка надсилання повідомлення до chatId: ${chatId}`, error);
            });
    });
}

app.post('/api/reviews', (req, res) => {
    const newReviews = req.body;

    if (typeof newReviews !== 'object' || newReviews === null) {
        console.log("Неправильний формат даних. Очікувався об'єкт.");
        return res.status(400).send("Неправильний формат даних. Очікувався об'єкт.");
    }
    try {
        addReviews(newReviews);
        res.status(200).send('Відгуки успішно оновлено');
        console.log('Відгуки успішно оновлено');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/api/data', async (req, res) => {
    const newOrder = req.body;

    try {
        sendNotification();
        console.log(newOrder);
        addOrder(newOrder);
        res.status(200).send('Замовлення успішно оновлено');
        console.log('Замовлення успішно оновлено');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/api/getReviews', (req, res) => {
    res.json(confirmedReviews);
    console.log("Підтверджені відгуки надіслано!");
});

app.listen(port, () => {
    console.log(`Сервер працює на http://localhost:${port}`);
});

bot.use(checkUserPermission);

bot.start((ctx) => {
    addChatId(ctx);
    console.log(`Отримано повідомлення від chat ID: ${ctx.chat.id}`);
    sendOptionsKeyboard(ctx);
});

//--------------------------------Feedbacks--------------------------------//

bot.hears('Відгуки', (ctx) => {
    addChatId(ctx);
    handleFeedbacks(ctx);
});

//--------------------------------Orders--------------------------------//

bot.hears('Замовлення', (ctx) => {
    addChatId(ctx);
    handleOrders(ctx);
    sendOptionsKeyboard(ctx);
});

//--------------------------------Delete from Feedbacks--------------------------------//

bot.hears('Видалити відгук', (ctx) => {
    addChatId(ctx);
    handleFeedbackElements(ctx);
});

bot.action(/add_(.+)/, (ctx) => {
    const reviewIndex = parseInt(ctx.match[1]);
    handleAddReview(ctx, reviewIndex);
});

bot.action(/reject_(.+)/, (ctx) => {
    handleRejectReview(ctx);
});

bot.action(/deleteReview_(.+)/, (ctx) => {
    handleDeleteFromReviews(ctx);
});

//--------------------------------Debuging--------------------------------//

bot.catch((err, ctx) => {
    console.error(`Помилка!!! ${ctx.updateType}`, err);
});

bot.launch();

module.exports = {
    sendOptionsKeyboard
}
