# Welcome to Twink Tokenizer

Twink tokenizer is a small tokenizer tool which automatically tags each token with its type via regular expression. 
Tokenize sentences and user are free to create their own token package. Some of it's top feature are outlined below:
1. Support for English and Swedish and many more.
2. Intelligent tokenization of sentence containing words, number, operators and special characters via regular expression which is provided from user.
3. Automatic detection & tagging of different types of tokens based on their features:

    - These include word, dot, number, float, integer och operators.
    - User define tokentyper (name/type, regex-regular expression).

## Installation

- Use [npm](https://www.npmjs.com/package/twink-tokenizer-js-tt) to install:
npm i twink-tokenizer-js-tt

- Come to github and clone this project and try it yourself
https://github.com/Thanhtran34/Twink-tokenizer/tree/main


## Getting started

```
import { Tokenizer, TokenTyper } from 'twink-tokenizer-js-tt'

// Create your own token package via give it a name and your sentence
const tokenizer = new Tokenizer('WORDANDDOTGRAMMAR', 'Meningen består av ord.')

// You add tokentyper to your tokenizer with regular expression. Remember to begin your regular expression with ^ and you don't need //g for your expression. The whitespace will be ignored in this tokenizer to make your tokenPackage simplier.
tokenizer.setRule(new TokenTyper('WORD', '^[a-zA-Z|äöåÄÖÅ]+$'))
tokenizer.setRule(new TokenTyper('DOT', '^\\.$'))

// Your own token package after matchning
const tokens = tokenizer.runTokenizer()
console.log(tokens)

// Result of token package
[
  {type: 'WORD', value: 'Meningen', line: 1, col: 1},
  {type: 'WORD', value: 'består', line: 1, col: 9},
  {type: 'WORD', value: 'av', line: 1, col: 15},
  {type: 'WORD', value: 'ord', line: 1, col: 17},
  {type: 'DOT', value: '.', line: 1, col: 20},
]

// Sometime, you just want only one token then use this getActiveToken method.
tokenizer.getActiveToken(tokens)
const currentToken = tokens.curr()
currentToken = {type: 'WORD', value: 'Meningen', line: 1, col: 1}

const nexttoken = tokens.next()
nexttoken = {type: 'WORD', value: 'består', line: 1, col: 9}

const previoustoken = tokens.prev()
previoustoken = {type: 'WORD', value: 'Meningen', line: 1, col: 1}

```

### Tokenizer an text document with Twink
```
const fileName = 'myTextFile.txt' // path to your text document
const fileData = fs.readFileSync(fileName, 'utf8')
const tokenizer = new Tokenizer('WORDANDDOTGRAMMAR', fileData)
tokenizer.setRule(new TokenTyper('WORD', '^[a-zA-Z|äöåÄÖÅ]+$'))
tokenizer.setRule(new TokenTyper('DOT', '^\\.$'))

const tokens = tokenizer.runTokenizer()
console.log(tokens)

// Result of token package
[
  {type: 'WORD', value: 'Meningen', line: 1, col: 1},
  {type: 'WORD', value: 'består', line: 1, col: 9},
  {type: 'WORD', value: 'av', line: 1, col: 15},
  {type: 'WORD', value: 'ord', line: 1, col: 17},
  {type: 'DOT', value: '.', line: 1, col: 20},
]

```

### About Twink
This small project is used for an assignment in school so it still need to improve more. Help me to upgrade it if you have interest for it. Its warm welcome from me. This new update will fix bug and make Twink stronger to tokenize the whole document istead of only one sentence.

### Copyright & License
It is licensed under the terms of the MIT License. You are free to use it so give it a try.