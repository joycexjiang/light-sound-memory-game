// global constants
const clueHoldTime = 400; //how long to hold each clue's light/sound; how long each clue should play for. 
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

//Global Variables
var pattern = [2, 2, 4, 3, 2, 5, 6, 1, 7, 4];
var progress = 0; 
var gamePlaying = false;
var tonePlaying = false;
var mistakes = 0;
var volume = 0.5;  //must be between 0.0 and 1.0
var guessCounter = 0;

//WOBBLY TEXT EFFECT
var speed=100; // speed of wobbling, lower is faster
var height=3; // height of wobbling in pixels
var alink="http://joycejiang.space"; // page to link text to (set to ="" for no link)

/****************************
*    Wobbly Text Effect     *
*(c) 2003-6 mf2fm web-design*
*  http://www.mf2fm.com/rv  *
* DON'T EDIT BELOW THIS BOX *
****************************/
var wobtxt, wobble, wobcnt=0;
window.onload=function() { if (document.getElementById) {
  var i, wobli;
  wobble=document.getElementById("wobble");
  wobtxt=wobble.firstChild.nodeValue;
  while (wobble.childNodes.length) wobble.removeChild(wobble.childNodes[0]);
  for (i=0; i<wobtxt.length; i++) {
    wobli=document.createElement("span");
    wobli.setAttribute("id", "wobb"+i);
    wobli.style.position="relative";
    wobli.appendChild(document.createTextNode(wobtxt.charAt(i)));
    if (alink) {
      wobli.style.cursor="pointer";
      wobli.onclick=function() { top.location.href=alink; }
    }
    wobble.appendChild(wobli);
  }
  setInterval("wobbler()", speed);
}}

function wobbler() {
  for (var i=0; i<wobtxt.length; i++) document.getElementById("wobb"+i).style.top=Math.round(height*Math.sin(i+wobcnt))+"px"
  wobcnt++;
}

//START GAME

function secretPattern(){
  pattern = Array.from({length: 4}, () => Math.floor(Math.random() * 4));
}


function startGame(){
  progress = 0;
  gamePlaying = true;
  mistakes=1;
  secretPattern();
  // swap the Start and Stop buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence();
}
  
function stopGame(){
  gamePlaying=false;
  document.getElementById("stopBtn").classList.add("hidden");
  document.getElementById("startBtn").classList.remove("hidden");
}

// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2,
  5: 503.4,
  6: 124.5,
  7: 900.2,
  8:204.4
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


//two functions for lighting or clearing a button
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

function playClueSequence(){
  guessCounter = 0;
  context.resume()
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime
    delay += cluePauseTime;
  }
}

function guess(btn){
  
  console.log("user guessed: " + btn);
  
  if(!gamePlaying){
    return;
  }
  
  if(pattern[guessCounter] == btn){
    //guess correct
    if(guessCounter == progress){
      if(progress == pattern.length - 1){
        //win game
        winGame();
      }else{
        //pattern is correct, increment progress
        progress++;
        playClueSequence();
      }
    }else{
      //increment guess counter
      guessCounter++;
    }
  }else{
    //guess incorrect
    strike();
  }
}    

function loseGame(){
  stopGame();
  alert("Game Over. You lost.");
}

function winGame(){
  stopGame();
  alert("Congrats! You won! :)");
}

function strike(){
  alert("strike ! You get 3 strikes.");
  mistakes++;
  if(mistakes>3){
      loseGame();
  }
}
