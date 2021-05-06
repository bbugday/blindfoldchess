import Chess from 'chess.js'

const chess = new Chess();

const files2 = {
  alpha: 'a',
  beta: 'b',
  charlie: 'c',
  delta: 'd',
  echo: 'e',
  fox: 'f',
  Fox: 'f',
  golf: 'g',
  hotel: 'h'
};

const files = {
  f: ['fox', 'Fox']
}

const ranks = {
  '1': ['One','one'],
  '2': ['Two', 'two'],
  '3': ['Three', 'three'],
  '4': ['Four', 'four'],
  '5': ['Five', 'five', 'V', 'v'],
  '6': ['Six', 'six'],
  '7': ['Seven', 'seven'],
  '8': ['Eight', 'eight']
}

const pieceTypes = {
  r: 'rook',
  n: 'knight',
  b: 'bishop',
  k: 'king',
  q: 'queen',
  p: 'pawn'
}

const colors = {
  b: 'black',
  w: 'white'
}

//speech recognition
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-GB';


//speech synthesis
const synth = window.speechSynthesis;

function playText(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = synth.getVoices()[3];
  utterance.rate = 0.8;
  speechSynthesis.speak(utterance);
}

function aiPlay(){
  let moves = chess.moves();
  const move = moves[Math.floor(Math.random() * moves.length)];
  playText("I played");
  for (var i = 0; i < move.length; i++) {
    playText(move.charAt(i));
  }
  chess.move(move);
  console.log(move);
}

window.addEventListener('keypress', function(e) {
  if(e.code == 'Space'){
    recognition.start();
  }
})

let speech = "";

recognition.onresult = function(event) {
  speech = event.results[0][0].transcript;
  console.log(speech);
}


//onspeechend ?
recognition.onend = function() {
  recognition.stop();
  handleSpeech(speech);// 3 durum: look,move,yanlış
  console.log(chess.ascii());
}

function handleSpeech(speech){
  let words = speech.split(' ');
  if(words[0] == 'look'){
    look(words);//if koy false ise invalid square desin
  }
  else{
    if(playerMove(words)){
      aiPlay();
    }
  }
}

function look(words){
  // boolean döndürsün try catch dene
  console.log("Words: " + words);
  console.log("words1: " + words[1] + "words2: " + words[2]);
  let square = wordToFile(words[1]) + wordToRank(words[2]);
  console.log("Square: " + square);
  let squareInfo = chess.get(square);
  console.log("Square Info: " + squareInfo);
  let color = colors[squareInfo['color']];
  console.log("Color: " + color);
  let type = pieceTypes[squareInfo['type']];
  playText('There is a ' + color + " " + type + " at there");
  //chess.get('a5')
  // -> { type: 'p', color: 'b' },
}


function playerMove(){
  //speech to move
  if(speech == "Alpha 4"){
    chess.move('a4');
    return true;
  }
  else if(speech == "beta 4"){
    chess.move('b4');
    return true;
  }
  return false;
}

function speechToMove(){
  
}

//util functions
function findInObject(object, searchingValue){
  for (const [key, value] of Object.entries(object)) {
    if(value.includes(searchingValue)){
        return key;
    }
  }
}

function wordToFile(word){
  return findInObject(word, files);
}

function wordToRank(word){
  return parseInt(word) ? word : findInObject(word, ranks);
}

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

function pieceTypeToChar(pieceType){
  return getKeyByValue(pieceTypes, pieceType);
}



