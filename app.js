const model = 'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/';
const oscillator = createOscillator(220)

const $success = document.querySelector(".success")
const $play = document.querySelector(".play")
$success.style.display = "none"
$play.style.display = "none"

let pitch;

function setup() {
  noCanvas();
  const audioContext = getAudioContext();
  const mic = new p5.AudioIn();
  mic.start(() => {
    pitch = ml5.pitchDetection(model, audioContext , mic.stream, modelLoaded);
  });
}

$play.addEventListener("click", () => {
  oscillator.start();
  setTimeout(() => {
    oscillator.stop()
    $play.style.display = "none" // Hide the play button
    setInterval(getPitch, 500) // Check the pitch every half second
  }, 1000)
})

function createOscillator(frequency) {
  const audio = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audio.createOscillator();

  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(frequency, audio.currentTime);
  oscillator.connect(audio.destination);
  return oscillator
}

function pitchIsCorrect(frequency){
  const lowerBoundary = 213.825 // Boundary of A
  const upperBoundary = 226.54 // Boundary of A

  return frequency > lowerBoundary && frequency < upperBoundary
}

function modelLoaded() {
  $play.style.display = "block"
}

function getPitch() {
  pitch.getPitch((err, frequency) => {
    if (frequency) {
      setPitchText(frequency)
    } else {
      setPitchText("No pitch detected")
    }

    if (frequency && pitchIsCorrect(frequency)){
      setPitchCorrect()
    }
  })
}

function setPitchCorrect(){
  document.querySelector('.pitch').style.display = "none"
  document.querySelector('.success').style.display = "block"
}

function setPitchText(text){
  document.querySelector('.pitch').textContent = text
}
