let video;
let myFaceMesh;
let myResults;
const EAR_THRESHOLD = 0.27;
let model;
let event;
let blinkCount = 0;
let isBlinking = false;
const options = {
    flipHorizontal: false, // boolean value for if the video should be flipped, defaults to false
    maxContinuousChecks: 5, // How many frames to go without running the bounding box detector. Only relevant if maxFaces > 1. Defaults to 5.
    detectionConfidence: 0.9, // Threshold for discarding a prediction. Defaults to 0.9.
    maxFaces: 1, // The maximum number of faces detected in the input. Should be set to the minimum number for performance. Defaults to 10.
    scoreThreshold: 0.75, // A threshold for removing multiple (likely duplicate) detections based on a "non-maximum suppression" algorithm. Defaults to 0.75.
    iouThreshold: 0.3, // A float representing the threshold for deciding whether boxes overlap too much in non-maximum suppression. Must be between [0, 1]. Defaults to 0.3.
    }


function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  video.size(640, 480);
  myFaceMesh = ml5.facemesh(video,options);
  myFaceMesh.on('predict', gotResults);
}


function gotResults(results) {
    if (results.length > 0) {
        results.forEach((prediction) => {
          // Right eye parameters
          const lowerRight = prediction.annotations.rightEyeUpper0;
          const upperRight = prediction.annotations.rightEyeLower0;
          const rightEAR = getEAR(upperRight, lowerRight);
          // Left eye parameters
          const lowerLeft = prediction.annotations.leftEyeUpper0;
          const upperLeft = prediction.annotations.leftEyeLower0;
          const leftEAR = getEAR(upperLeft, lowerLeft);
    
          // True if the eye is closed
          const blinked = leftEAR <= EAR_THRESHOLD && rightEAR <= EAR_THRESHOLD;
    
          // Determine how long you blinked
          if (blinked) {
            event = {
              shortBlink: false,
              longBlink: false,
            };
            isBlinking = true;
            blinkCount += 1;
          } else {
            event = {
              shortBlink: blinkCount <= 5 && blinkCount != 0,
              longBlink: blinkCount > 5,
            };
            isBlinking = false;
            blinkCount = 0;
          } 
        });
        console.log("is working");
      }
}

function draw() {
    if(isBlinking === true){
        background(255, 0, 0);
    }
    else {
        background(0,0,255);
    }
}




function getEAR(upper, lower) {
    function getEucledianDistance(x1, y1, x2, y2) {
      return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    }
  
    return (
      (getEucledianDistance(upper[5][0], upper[5][1], lower[4][0], lower[4][1])
        + getEucledianDistance(
          upper[3][0],
          upper[3][1],
          lower[2][0],
          lower[2][1],
        ))
      / (2
        * getEucledianDistance(upper[0][0], upper[0][1], upper[8][0], upper[8][1]))
    );
  }
