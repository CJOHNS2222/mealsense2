const functions = require("firebase-functions");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require("cors")({origin: true});
const { defineString } = require('firebase-functions/params');

const geminiAPIKey = defineString("GEMINI_API_KEY");

/**
 * HTTPs function that can handle both text and vision requests to the Gemini API.
 */
exports.callGemini = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    // Initialize the Gemini client inside the function
    const genAI = new GoogleGenerativeAI(geminiAPIKey.value());

    // The onCall authentication check is no longer available.
    // For now, we are allowing unauthenticated access.
    // TODO: Implement authentication for onRequest functions if needed.

    // For onRequest, data is in req.body.data
    const { modelName, contents, generationConfig, systemInstruction } = req.body.data;

    if (!modelName || !contents) {
      console.error("Request failed with invalid arguments:", req.body.data);
      res.status(400).send({
        error: "The function must be called with 'modelName' and 'contents' arguments.",
      });
      return;
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

      res.send({ data: { result: result.response } });
    } catch (error) {
      console.error("Gemini API call failed:", error);
      res.status(500).send({
        error: {
          message: error.message,
          details: error.details,
        },
      });
    }
  });
});
