const { Markup } = require('telegraf');
const { sendOptionsKeyboard } = require('./Keyboard');

let orders = [];

function addOrder(newOrder) {
    orders.push(newOrder); // Додаємо нове замовлення в масив
    console.log('Order added:', newOrder);
    console.log('All orders:', orders);
}

function formatOrder(order) {
    return `Назва: ${order.title}\nОпис: ${order.description}\nВага: ${order.weight}г\nЦіна: ${order.price} грн\nКількість: ${order.count}`;
}

function formatUserDetails(user) {
    return `Ім'я: ${user.firstName}\nПрізвище: ${user.lastName}\nТелефон: ${user.phone}\nEmail: ${user.email}\nАдреса: ${user.street} ${user.house}, під'їзд: ${user.entrance}, поверх: ${user.floor}, квартира: ${user.apartment}\nКоментар: ${user.comment}\nКількість осіб: ${user.numberOfPersons}\nСпосіб оплати: ${user.paymentMethod}`;
}

function handleOrders(ctx) {
    if (orders !== null && Array.isArray(orders) && orders.length > 0) {
        orders.forEach(orderData => {
            let message = formatUserDetails(orderData.user) + "\n\n";
            orderData.orders.forEach(order => {
                message += formatOrder(order) + "\n\n";
            });

            console.log(`Message: ${message}`);

            ctx.reply(message);
        });

        orders = [];
        sendOptionsKeyboard(ctx);

    } else {
        ctx.reply('Нема нових замовлень');
        console.error('handleOrders ERROR: No orders found or invalid data');
    }
}


module.exports = {
    addOrder,
    handleOrders
};