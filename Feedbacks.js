const { Markup } = require('telegraf');
const { sendOptionsKeyboard } = require('./Keyboard');

let reviews = [];

let processedFeedbacks = 0;
let reviewsLength = reviews.length;
let confirmedReviews = [];

function addReviews(newReview) {
    if (typeof newReview !== 'object' || newReview === null) {
        throw new TypeError('newReview is not an object.');
    }

    reviews.push(newReview); // Додаємо новий відгук в масив
    console.log('Review added:', newReview);
    console.log('All reviews:', reviews);
    processedFeedbacks = 0;
    reviewsLength = reviews.length;
}

function handleFeedbacks(ctx) {
    if (reviews.length === 0) {
        ctx.reply('Усі відгуки опрацьовані.');
        console.log(`confirmedReviews ${JSON.stringify(confirmedReviews, null, 2)}`);
        console.log(`reviews ${JSON.stringify(reviews, null, 2)}`);
        sendOptionsKeyboard(ctx);
    } else {
        reviews.forEach((_, index) => {
            sendReview(ctx, index);
        });
    }
}

function sendReview(ctx, index) {
    const review = reviews[index];
    ctx.reply(`Ім'я: ${review.firstName}\nПрізвище: ${review.lastName}\nТелефон: ${review.phone}\nВідгук: ${review.comment}\nОцінка: ${review.rating}`, 
        Markup.inlineKeyboard([
            Markup.button.callback('Додати', `add_${index}`),
            Markup.button.callback('Видалити', `reject_${index}`)
        ]));
}

function allReviewsProcessed(ctx){
    if (processedFeedbacks === reviewsLength) {
        reviews = [];
        ctx.reply('Усі відгуки опрацьовані.');
        console.log(`confirmedReviews ${JSON.stringify(confirmedReviews, null, 2)}`);
        console.log(`reviews ${JSON.stringify(reviews, null, 2)}`);
        sendOptionsKeyboard(ctx);
    }
}

function handleAddReview(ctx, reviewIndex) {
    confirmedReviews.push(reviews[reviewIndex]);
    processedFeedbacks += 1;
    ctx.deleteMessage();
    allReviewsProcessed(ctx);
}

function handleRejectReview(ctx) {
    processedFeedbacks += 1;
    ctx.deleteMessage();
    allReviewsProcessed(ctx);
}

module.exports = {
    handleFeedbacks,
    handleAddReview,
    handleRejectReview,
    confirmedReviews,
    addReviews
};
