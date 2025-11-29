const functions = require("firebase-functions");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { defineString } = require('firebase-functions/params');

// Using a new secret name to bypass any potential caching issues.
const geminiAPIKey = defineString("GEMINI_API_KEY_LATEST");

const admin = require("firebase-admin");

// Option 1: Auto-initialize (works when deployed to Firebase)
admin.initializeApp();

// Option 2: Use service account (only if running locally)
// const serviceAccount = require("./serviceAccountKey.json");
// admin.initializeApp({
//   credential: admin.cert(serviceAccount)
// });
/**
 * HTTPs callable function that can handle both text and vision requests to the Gemini API.
 */
exports.callGemini = functions.https.onCall(async (data, context) => {
  // Check if the user is authenticated.
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }

  // Initialize the Gemini client inside the function
  const genAI = new GoogleGenerativeAI(geminiAPIKey.value());

  // For onCall, data is the first argument.
  const { modelName, contents, generationConfig, systemInstruction } = data;

  if (!modelName || !contents) {
    console.error("Request failed with invalid arguments:", data);
    throw new functions.https.HttpsError('invalid-argument', "The function must be called with 'modelName' and 'contents' arguments.");
  }

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
    // Re-throwing the error is important for the client to receive it.
    throw new functions.https.HttpsError('internal', error.message, error.details);
  }
});
