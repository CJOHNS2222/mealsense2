const functions = require("firebase-functions");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Get Gemini Key from Firebase config
const genAI = new GoogleGenerativeAI(functions.config().gemini.key);

/**
 * Callable function that can handle both text and vision requests to the Gemini API.
 */
exports.callGemini = functions.https.onCall(async (data, context) => {
  // Check authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }

  const { modelName, contents, generationConfig, systemInstruction } = data;

  if (!modelName || !contents) {
      throw new functions.https.HttpsError(
          "invalid-argument",
          "The function must be called with 'modelName' and 'contents' arguments."
      );
  }

  try {
    const model = genAI.getGenerativeModel({ 
        model: modelName,
        systemInstruction: systemInstruction 
    });

    const result = await model.generateContent({
        contents: contents,
        generationConfig: generationConfig
    });
    
    return { result: result.response };

  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new functions.httpshttps.HttpsError("internal", error.message, error.details);
  }
});
