const functions = require('firebase-functions')

module.exports = functions.https.onRequest((request, response) => {
 response.send("Check out this custom function from Firebase!")
});
