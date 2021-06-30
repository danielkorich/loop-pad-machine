function playSegment(audioObj, start, stop) {
  audioObj.currentTime = start;
  audioObj.play();
  audioObj.int = setInterval(function () {
    if (audioObj.paused) {
      clearInterval(audioObj.int);
    }
    if (audioObj.currentTime > stop) {
      audioObj.pause();
      clearInterval(audioObj.int);
    }
  }, 10);
}

export default playSegment;
