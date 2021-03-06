// global constants
const clueHoldTime = 400; //how long to hold each clue's light/sound; how long each clue should play for.
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

let three = new Array(9);

//Global Variables
var pattern = [2, 2, 4, 3, 2, 5, 6, 1, 7, 4];
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var mistakes = 0;
var volume = 0.5; //must be between 0.0 and 1.0
var guessCounter = 0;


var red = document.getElementsByClassName("closebutton")[0];

red.onclick = function() {
    var popup = document.getElementsByClassName("popup")[0];
    $(popup).hide();
};


//START GAME

function secretPattern() {
  pattern = Array.from({ length: 10 }, () => Math.floor(Math.random() * 9));
}

function startGame() {
  progress = 0;
  gamePlaying = true;
  mistakes = 1;
  secretPattern();
  // swap the Start and Stop buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  document.getElementById("pattern").classList.add("hidden");
  playClueSequence();
}

function stopGame() {
  gamePlaying = false;
  document.getElementById("stopBtn").classList.add("hidden");
  document.getElementById("startBtn").classList.remove("hidden");
}

// Sound Synthesis Functions
const freqMap = {
  0: 440.2,
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2,
  5: 503.4,
  6: 124.5,
  7: 900.2,
  8: 204.4,
  9: 250.3,
  10: 350.2,
  12: 390,
};

function playTone(btn, len) {
  o.frequency.value = freqMap[btn];
  g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
  context.resume();
  tonePlaying = true;
  setTimeout(function () {
    stopTone();
  }, len);
}

function startTone(btn) {
  if (!tonePlaying) {
    context.resume();
    o.frequency.value = freqMap[btn];
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
    context.resume();
    tonePlaying = true;
  }
}

function stopTone() {
  g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025);
  tonePlaying = false;
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var o = context.createOscillator();
var g = context.createGain();
g.connect(context.destination);
g.gain.setValueAtTime(0, context.currentTime);
o.connect(g);
o.start(0);

//two functions for lighting or clearing a button
function lightButton(btn) {
  document.getElementById("button" + btn).classList.add("lit");
}
function clearButton(btn) {
  document.getElementById("button" + btn).classList.remove("lit");
}

function playSingleClue(btn) {
  if (gamePlaying) {
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
  }
}

function playClueSequence() {
  guessCounter = 0;
  context.resume();
  let delay = nextClueWaitTime; //set delay to initial wait time
  for (let i = 0; i <= progress; i++) {
    // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
    setTimeout(playSingleClue, delay, pattern[i]); // set a timeout to play that clue
    delay += clueHoldTime;
    delay += cluePauseTime;
  }
}

function guess(btn) {
  console.log("user guessed: " + btn);

  if (!gamePlaying) {
    return;
  }

  if (pattern[guessCounter] == btn) {
    //guess correct
    if (guessCounter == progress) {
      if (progress == pattern.length - 1) {
        //win game
        winGame();
      } else {
        //pattern is correct, increment progress
        progress++;
        playClueSequence();
      }
    } else {
      //increment guess counter
      guessCounter++;
    }
  } else {
    //guess incorrect
    strike();
  }
}

function loseGame() {
  stopGame();
  alert("Game Over. You lost.");
}

function winGame() {
  stopGame();
  alert("Congrats! You won! :)");
  showNum(pattern);
}

function strike() {
  alert("strike ! You get 3 strikes.");
  mistakes++;
  if (mistakes > 3) {
    loseGame();
    document.getElementById("pattern").classList.remove("hidden");
  }
}

function showNum(pattern) {
  const element = document.getElementById("pattern");
  element.innerHTML = pattern.join("");
  element.classList.remove("hidden");
}

var bgcolour = "none"; // background colour
var hlcolour = "#FCFBCB"; // highlight colour
var speed = 250; // speed colours change, 1 second = 1000

/****************************
 *    Phone-In Text Effect   *
 *(c) 2003-6 mf2fm web-design*
 *  http://www.mf2fm.com/rv  *
 * DON'T EDIT BELOW THIS BOX *
 ****************************/
var p_txt;
window.onload = function () {
  if (document.getElementById) {
    var phoni;
    var phone = document.getElementById("pattern");
    p_txt = phone.firstChild.nodeValue;
    while (phone.childNodes.length) phone.removeChild(phone.childNodes[0]);
    for (var i = 0; i < p_txt.length; i++) {
      phoni = document.createElement("div");
      phoni.style.display = "inline";
      phoni.setAttribute("id", "phon" + i);
      phoni.appendChild(document.createTextNode(p_txt.charAt(i)));
      phone.appendChild(phoni);
    }
    phone_me((p_txt = p_txt.length) - 1);
  }
};

function phone_me(p_cnt) {
  var p_tmp = document.getElementById("phon" + p_cnt);
  p_tmp.style.fontWeight = "normal";
  if (document.all) p_tmp.style.filter = "";
  p_cnt = ++p_cnt % p_txt;
  p_tmp = document.getElementById("phon" + p_cnt);
  -[];
  if (p_tmp.firstChild.nodeValue != " ") {
    p_tmp.style.fontWeight = "bold";
    if (document.all)
      p_tmp.style.filter = "GLOW(strength=3, color=#" + bgcolour + ")";
    p_tmp.style.backgroundColor = hlcolour;
  }
  setTimeout("phone_me(" + p_cnt + ")", speed);
}



function popupOpenClose(popup) {
  /* Add div inside popup for layout if one doesn't exist */
  if ($(".tabcontent").length == 0) {
    $(popup).wrapInner("<div class='tabcontent'></div>");
  }

  /* Open popup */
  $(popup).show();

  /* Close popup if user clicks on background */
  $(popup).click(function (e) {
    if (e.target == this) {
      if ($(popup).is(":visible")) {
        $(popup).hide();
      }
    }
  });

  /* Close popup and remove errors if user clicks on cancel or close buttons */
}

$(document).ready(function () {
  $('.imagepic').on("click", function () {
    popupOpenClose($(".popup"));
  });
});
