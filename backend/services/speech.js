import { SpeechClient } from "@google-cloud/speech";

const speechClient = new SpeechClient({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GMUTEX_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
});

export const recognizeSpeech = async (audioData, languageCode) => {
  const request = {
    audio: { content: audioData },
    config: {
      encoding: "WEBM_OPUS",
      sampleRateHertz: 48000,
      languageCode: languageCode || "en-US",
    },
  };

  const [response] = await speechClient.recognize(request);
  return response.results
    .map((result) => result.alternatives?.[0]?.transcript || "")
    .join("\n")
    .trim();
};