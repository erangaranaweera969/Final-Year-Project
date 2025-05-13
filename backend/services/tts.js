import textToSpeech from "@google-cloud/text-to-speech";

const ttsClient = new textToSpeech.TextToSpeechClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

export const synthesizeSpeech = async (text, languageCode) => {
  const request = {
    input: { text },
    voice: { languageCode: languageCode || "en-US", ssmlGender: "NEUTRAL" },
    audioConfig: { audioEncoding: "MP3" },
  };

  const [response] = await ttsClient.synthesizeSpeech(request);
  return response.audioContent.toString("base64");
};