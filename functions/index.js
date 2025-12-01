// Export testCallable for debugging
exports.testCallable = require('./testCallable').testCallable;
const functions = require("firebase-functions");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { defineString } = require('firebase-functions/params');

// Using a new secret name to bypass any potential caching issues.
const geminiAPIKey = defineString("GEMINI_API_KEY_LATEST");


const admin = require("firebase-admin");
let adminConfig = {};
try {
  // Use service account for local development
  const serviceAccount = require("./firebaseKey.json");
  adminConfig.credential = admin.cert(serviceAccount);
  console.log("Using local service account for firebase-admin initialization.");
} catch (e) {
  // Fallback to default credentials (works on Firebase Cloud Functions)
  console.log("Using default credentials for firebase-admin initialization.");
}
admin.initializeApp(adminConfig);
/**
 * HTTPs callable function that can handle both text and vision requests to the Gemini API.
 */
exports.callGemini = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }
  const  isAnonymous  = context.auth.token.firebase.sign_in_provider === 'anonymous';

  const { modelName, contents, generationConfig, systemInstruction } = data;
  if (!modelName || !contents) {
    console.error("Request failed with invalid arguments:", data);
    throw new functions.https.HttpsError('invalid-argument', "The function must be called with 'modelName' and 'contents' arguments.");
  }

  const genAI = new GoogleGenerativeAI(geminiAPIKey.value());

  try {
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: systemInstruction,
    });

    const result = await model.generateContent({
      contents: contents,
      generationConfig: generationConfig,
    });

    return { result: result.response };
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new functions.https.HttpsError('internal', error.message, error.details);
  }
});

