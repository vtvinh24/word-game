import * as Speech from "expo-speech";
import { Audio } from "expo-av";

let recording = null;
let recognitionListener = null;

export const startVoiceRecognition = async (onResult, onError) => {
  try {
    // Request permissions
    const { status } = await Audio.requestPermissionsAsync();
    if (status !== "granted") {
      onError("Permission to access microphone was denied");
      return false;
    }

    // Start recording
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    });

    recording = new Audio.Recording();
    await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);

    // Set up recognition listener
    recognitionListener = { onResult, onError };

    await recording.startAsync();
    return true;
  } catch (error) {
    onError(`Error starting voice recognition: ${error.message}`);
    return false;
  }
};

export const stopVoiceRecognition = async () => {
  if (recording) {
    try {
      await recording.stopAndUnloadAsync();

      // In a real app, you would send the audio to a speech-to-text service
      // For demo purposes, we'll simulate a response
      if (recognitionListener?.onResult) {
        // Simulate processing delay
        setTimeout(() => {
          recognitionListener.onResult("example");
        }, 1000);
      }

      recording = null;
      return true;
    } catch (error) {
      console.error("Failed to stop recording", error);
      return false;
    }
  }
  return false;
};
