{showCamera ? (
  <Webcam
    audio={false}
    ref={webcamRef}
    screenshotFormat="image/jpeg"
    videoConstraints={videoConstraints}
    className="rounded-xl"
  />
) : (
  <div className="w-32 h-32 bg-pink-200 rounded-full flex items-center justify-center">
    <Camera className="h-12 w-12 text-pink-600" />
  </div>
)}
