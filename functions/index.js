const functions = require('firebase-functions');
const algoliasearch = require('algoliasearch');

const APP_ID = functions.config().algolia.app;
const ADMIN_KEY = functions.config().algolia.key;

const client = algoliasearch(APP_ID, ADMIN_KEY);
const itemsIndex = client.initIndex('items');
const messagesIndex = client.initIndex('messages');
const usersIndex = client.initIndex('user-profiles');
const reviewsIndex = client.initIndex('reviews');

exports.addItem = functions.firestore.document('items/{itemId}')
    .onCreate(snapshot => {
        const data = snapshot.data();
        const objectID = snapshot.id;

        return itemsIndex.saveObject({ ...data, objectID });
    });
exports.updateItem = functions.firestore.document('items/{itemId}')
    .onUpdate((change) => {
        const newData = change.after.data();
        const objectID = change.after.id;
        return itemsIndex.saveObject({ ...newData, objectID });
    });
exports.deleteItem = functions.firestore.document('items/{itemId}')
    .onDelete(snapshot => itemsIndex.deleteObject(snapshot.id));

exports.addMessage = functions.firestore.document('messages/{messageId}')
    .onCreate(snapshot => {
        const data = snapshot.data();
        const objectID = snapshot.id;

        return messagesIndex.saveObject({ ...data, objectID });
    });
exports.updateMessage = functions.firestore.document('messages/{messageId}')
    .onUpdate((change) => {
        const newData = change.after.data();
        const objectID = change.after.id;
        return messagesIndex.saveObject({ ...newData, objectID });
});
exports.deleteMessage = functions.firestore.document('messages/{messageId}')
    .onDelete(snapshot => messagesIndex.deleteObject(snapshot.id));

exports.addUser = functions.firestore.document('user-profiles/{userId}')
    .onCreate(snapshot => {
        const data = snapshot.data();
        const objectID = snapshot.id;

        return usersIndex.saveObject({ ...data, objectID });
    });
exports.updateUser = functions.firestore.document('user-profiles/{userId}')
    .onUpdate((change) => {
        const newData = change.after.data();
        const objectID = change.after.id;
        return usersIndex.saveObject({ ...newData, objectID });
});
exports.deleteUser = functions.firestore.document('user-profiles/{userId}')
    .onDelete(snapshot => usersIndex.deleteObject(snapshot.id));

exports.addReview = functions.firestore.document('reviews/{reviewId}')
    .onCreate(snapshot => {
        const data = snapshot.data();
        const objectID = snapshot.id;

        return reviewsIndex.saveObject({ ...data, objectID });
    });
exports.updateReview = functions.firestore.document('reviews/{reviewId}')
    .onUpdate((change) => {
        const newData = change.after.data();
        const objectID = change.after.id;
        return reviewsIndex.saveObject({ ...newData, objectID });
    });
exports.deleteReview = functions.firestore.document('reviews/{reviewId}')
    .onDelete(snapshot => reviewsIndex.deleteObject(snapshot.id));
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
