import * as faceapi from 'face-api.js';

const loadModels = async () => {
  const MODEL_URL = '/models'; // folder where models are hosted
  await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
  await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
  await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
  // other models you need
};
export default loadModels;