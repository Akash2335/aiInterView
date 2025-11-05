initFaceObserverconst initFaceObserver = async (videoRef, setFacePoints) => {
  await loadModels(); // load first

  const video = videoRef.current;
  if (!video) return;

  video.addEventListener('play', () => {
    const interval = setInterval(async () => {
      const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());
      // analyze detections and update facePoints
      setFacePoints(detections.map(d => `Face detected at ${d.detection.box.x},${d.detection.box.y}`));
    }, 200); // every 200ms
  });
};
