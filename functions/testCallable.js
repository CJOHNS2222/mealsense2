// Simple test callable function for debugging auth and callable setup
const functions = require("firebase-functions");

exports.testCallable = functions.https.onCall((data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Not signed in');
  }
  return {
    message: 'Callable function works!',
    uid: context.auth.uid,
    isAnonymous: context.auth.token.firebase.sign_in_provider === 'anonymous'
  };
});
