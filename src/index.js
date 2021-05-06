import Chess from 'chess.js'

const chess = new Chess();
const board = Chessboard('chessboard', 'start');

const files = {
  a: ['Alpha', 'alpha'],
  b: ['Beta', 'beta', 'Bravo', 'bravo'],
  c: ['Charlie', 'charlie'],
  d: ['Delta', 'delta'],
  e: ['Echo', 'echo'],
  g: ['Golf', 'golf'],
  f: ['Fox', 'fox'],
  h: ['Hotel', 'hotel'],
}

const ranks = {
  '1': ['1', 'One','one'],
  '2': ['2', 'Two', 'two', 'to'],
  '3': ['3', 'Three', 'three'],
  '4': ['4','Four', 'four', 'full', 'before'],
  '5': ['5', 'Five', 'five', 'V', 'v'],
  '6': ['6', 'Six', 'six'],
  '7': ['7', 'Seven', 'seven'],
  '8': ['8', 'Eight', 'eight']
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
  speechSynthesis.speak(utterance);
}

function aiPlay(){
  const moves = chess.moves();
  const randomMove = moves[Math.floor(Math.random() * moves.length)];
  playText("I played");
  for (var i = 0; i < randomMove.length; i++) {
    playText(randomMove.charAt(i)); //to do: change to e4-e5 notation type
  }
  const move = chess.move(randomMove);
  board.move(move.from + '-' + move.to)
}

window.addEventListener('keypress', function(e) {
  if(e.code == 'Space'){
    recognition.start();
  }
})

let speech = '';

recognition.onresult = function(event) {
  speech = event.results[0][0].transcript;
  console.log('speech: ' + speech);
}

recognition.onend = function() {
  recognition.stop();
  handleSpeech(speech);
}

function handleSpeech(speech){
  try {
    let words = parseSpeech(speech);
    if(words[0] == 'look'){
      look(words);
    }
    else{
      playerMove(words);
      aiPlay();
    }
  } catch (error) {
    console.error(error);
    playText(error.message);
  }
}

function look(words){
  //to do: try catch
  let square = wordToFile(words[1]) + wordToRank(words[2]);
  let squareInfo = chess.get(square);
  let color = colors[squareInfo['color']];
  let type = pieceTypes[squareInfo['type']];
  playText('There is a ' + color + " " + type + " at there");
  //chess.get('a5')
  // -> { type: 'p', color: 'b' },
}


function playerMove(words){
  const move = wordsToMove(words);
  //to do: split functions
  const validMoves = chess.moves({square: move.from});
  if(!validMoves.includes(move.to)){
    throw new InvalidMove('Invalid move');
  }
  chess.move({from: move.from, to: move.to});
  board.move(move.from + '-' + move.to);
}

function wordsToMove(words){
  if(words.length != 4){
    throw new InvalidSize('Speech must include 4 words');
  }
  const from = wordToFile(words[0]) + wordToRank(words[1]);
  const to = wordToFile(words[2]) + wordToRank(words[3]);
  const move = {from, to};
  return move;
}

function parseSpeech(speech){
  const words = speech.split(' ');
  return words;
}

//util functions
function findInObject(object, searchingValue){
  for (const [key, value] of Object.entries(object)) {
    if(value.includes(searchingValue)){
        return key;
    }
  }
  throw new InvalidParameter('Value not found in object');
}

function wordToFile(word){
  try {
    return findInObject(files, word);
  } catch (error) {
    throw new InvalidParameter('File not found');
  }
}

function wordToRank(word){
  try {
    return findInObject(ranks, word);
  } catch (error) {
    throw new InvalidParameter('Rank not found');
  }
}

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

function pieceTypeToChar(pieceType){
  return getKeyByValue(pieceTypes, pieceType);
}

function InvalidParameter(message) {
  this.message = message;
  this.name = 'InvalidParameter';
}

function InvalidSize(message) {
  this.message = message;
  this.name = 'InvalidSize';
}

function InvalidMove(message) {
  this.message = message;
  this.name = 'InvalidMove';
}
