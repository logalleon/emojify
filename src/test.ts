import Emojify from "./Controllers/Emojify";
var emoji = new Emojify();

var exampleString = "knife :knife1: :knife2: :knife3: :knife4: :knife5:";
//  console.log(emoji.parseRequest(exampleString));
// console.log(emoji.process(exampleString));
//               012345678
exampleString = "dolla dolla mimault yall :thumbsup::skin-tone-1: :no:";
// console.log(emoji.parseRequest(exampleString));
console.log(emoji.process(exampleString));
// exampleString = "hello :no::killer: you jerk ";
// console.log(emoji.parseRequest(exampleString));
// console.log(emoji.process(exampleString));
// exampleString = "help";
// console.log(emoji.parseRequest(exampleString));
// console.log(emoji.process(exampleString));
// exampleString = "help me";
// console.log(emoji.parseRequest(exampleString));
// console.log(emoji.process(exampleString));
// exampleString = "help me > :no:";
// console.log(emoji.parseRequest(exampleString));
// console.log(emoji.process(exampleString));