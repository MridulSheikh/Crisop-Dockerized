import Groq from "groq-sdk/index.js";
import config from ".";

export const groq = new Groq({
  apiKey: config.GROQ_API_KEY
});

export const groqAiModel =  "openai/gpt-oss-20b"