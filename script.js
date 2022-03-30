//Global Constants
const clueHoldTime = 600;
const cluePauseTime = 200;
const nextClueWaitTime = 600;

//Global Variables
var pattern = [];
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5; //must be between 0.0 to 1.0
var guessCounter = 0;


function startGame(){
  pattern = Array.from({length: 7}, () => Math.floor(Math.random() * (8)) + 1);
  console.log(pattern)
  //initialize game variables
  progress = 0;
  gamePlaying = true;
  
  //swap the start and stop buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  
  playClueSequence();
}

function stopGame(){
  gamePlaying = false;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}


function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}
function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}


function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

function loseGame(){
  stopGame();
  alert("Game Over. You lost.")
}
function winGame(){
  stopGame();
  alert("Game Over. You won!")
}
// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 293.66,
  3: 329.6,
  4: 349.23,
  5: 392,
  6: 440,
  7: 493.88,
  8: 523.25
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  context.resume()
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    context.resume()
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    context.resume()
    tonePlaying = true
  }
}
function stopTone(){
  g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
  tonePlaying = false
}

function playClueSequence(){
  guessCounter = 0;
  context.resume()
  let delay = nextClueWaitTime;
  for(let i=0;i<=progress;i++){
    console.log("play single clue: "+ pattern[i] + " in "+ delay + "ms")
    setTimeout(playSingleClue, delay, pattern[i])
    delay += clueHoldTime
    delay += cluePauseTime;
  }
}

function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }
  //where logic comes in.
  //1. check if clicked btn = pattern[guessCounter]
  if(pattern[guessCounter] == btn){
    //1-1. check if the pattern reached end
    if(guessCounter == progress){
      if(progress == pattern.length -1){
        winGame();
      }else{
        //1-2. increase pattern element if not end
        progress++;
        playClueSequence();
      }
    }else{
      //2.continue if the check is not finished
      guessCounter++;
    }
  }else{
    //3. if btn != pattern[guessCounter]
    loseGame();
  }
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext 
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)