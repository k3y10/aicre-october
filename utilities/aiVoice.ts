import { openaiApiKey } from '@/constants/env';
import { generateCREInsights } from './aiText';

// Define the PropertyInfo interface, or import it from aiUtils.ts if it exists there
interface PropertyInfo {
  propertyId: string;
  propertyName: string;
  value: number;
  noi: number;
  leverage: number;
  dscr: number;
  ownershipPercentage: number;
  location: string;
  latitude: number;
  longitude: number;
}

// Example: Using OpenAI Whisper API for Speech-to-Text
export const convertSpeechToText = async (): Promise<string | null> => {
  try {
    const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(mediaStream);
    const audioChunks: BlobPart[] = [];

    mediaRecorder.ondataavailable = (e) => {
      audioChunks.push(e.data);
    };

    const speechToText = new Promise<string | null>((resolve, reject) => {
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('file', audioBlob);
        formData.append('model', 'whisper-1'); // Replace with your OpenAI model for Whisper

        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${openaiApiKey}`,
          },
          body: formData,
        });

        const data = await response.json();
        if (data.text) {
          resolve(data.text); // Return the recognized text
        } else {
          reject('Speech-to-text failed.');
        }
      };

      mediaRecorder.start();
      setTimeout(() => mediaRecorder.stop(), 5000); // Record for 5 seconds
    });

    return await speechToText;
  } catch (error) {
    console.error('Error converting speech to text:', error);
    return null;
  }
};

// Example: Using Google Cloud or another TTS API for Text-to-Speech
export const convertTextToSpeech = async (text: string): Promise<void> => {
  const request = {
    input: { text },
    voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
    audioConfig: { audioEncoding: 'MP3' },
  };

  // Example using Google Cloud Text-to-Speech
  const response = await fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  const data = await response.json();
  if (data.audioContent) {
    const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
    audio.play();
  } else {
    console.error('Text-to-speech failed.');
  }
};

// Function to handle user input (via voice) and generate insights
export const handleVoiceInput = async (
  properties: PropertyInfo[],
  onInsightsGenerated: (insights: string) => void
): Promise<void> => {
  try {
    // Convert voice to text
    const voiceInput = await convertSpeechToText();
    if (!voiceInput) {
      console.error('No voice input detected.');
      return;
    }

    // Process the input (for example, based on user commands)
    console.log(`Recognized Voice Input: ${voiceInput}`);

    // Generate insights for the properties based on voice command
    const insights = await generateCREInsights(properties);
    if (insights) {
      console.log('Generated Insights:', insights);
      onInsightsGenerated(insights);

      // Convert insights (text) back to speech
      await convertTextToSpeech(insights);
    } else {
      console.error('Failed to generate insights.');
    }
  } catch (error) {
    console.error('Error handling voice input:', error);
  }
};
