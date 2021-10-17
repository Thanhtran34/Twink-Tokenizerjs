/**
 * Module for tokenizer string input.
 *
 * @author Thanh Tran
 * @version 1.0.1
 */
import { Grammar } from './Grammar.js'

/**
 * A class to tokenize all type of token.
 *
 * @class Tokenizer
 *
 */
export class Tokenizer {
  /**
   * Creates an instance of Tokenizer.
   *
   * @param {string} name - the grammar's name.
   * @param {string} userinput - the user input.
   */
  constructor (name, userinput) {
    this.packageName = name.toUpperCase()
    this.grammar = new Grammar()
    this.userInput = userinput
    this.tokenPackage = []
    this.tokenBuffer = ''
    this.tokenTypers = []
    this.line = 1
    this.col = 1
    this.token = {}
  }

  /**
   * Method to set rule for tokenizer.
   *
   * @param {*}tokentyper - the token typer of each token.
   * @returns {Array}tokentypers - the tokentypers array.
   */
  setRule (tokentyper) {
    this.tokenTypers = this.grammar.addRule(tokentyper)
    return this.tokenTypers
  }

  /**
   * Method to run the tokenizer.
   *
   * @returns {*} - the token pacakage.
   */
  runTokenizer () {
    this.startTokenizer(this.userInput)
    this.endTokenizer()
    return this.tokenPackage
  }

  /**
   * Method to setup the token.
   *
   * @param {*} value - the value of the token.
   * @param {*} type - the type of the token.
   * @returns {*} - each token.
   */
  setUpToken (value, type) {
    this.token = {
      type: type,
      value: value,
      line: this.line,
      col: this.col
    }
    const lines = value.split('\n')
    this.line += lines.length - 1
    this.col = (lines.length > 1 ? 1 : this.col) + lines[lines.length - 1].length
    return this.token
  }

  /**
   * Method to begin tokenizer.
   *
   * @param {string} text - the user input.
   * @returns {*} - an array of tokens.
   */
  startTokenizer (text) {
    let input = this.tokenBuffer + text
    let m = this.grammar.findMaxIndexAndRule(this.tokenTypers, input)
    while (m && m.maxIndex !== input.length + 1) {
      this.tokenPackage.push(this.setUpToken(input.substring(0, m.maxIndex), m.rule.tokenname))
      // check for the next token
      input = input.substring(m.maxIndex).trim()
      m = this.grammar.findMaxIndexAndRule(this.tokenTypers, input)
    }
    this.tokenBuffer = input
    return this.tokenPackage
  }

  /**
   * Method to end tokenizer proccess.
   *
   */
  endTokenizer () {
    if (this.tokenBuffer.length === 0) {
      return
    }
    const tokentyper = this.grammar.findMatchningRule(this.tokenTypers, this.tokenBuffer)
    if (!tokentyper) {
      throw new Error(JSON.stringify({
        message: 'Lexical error: Wrong format of input',
        src: this.tokenBuffer,
        line: this.line,
        col: this.col
      }))
    }

    this.setUpToken(this.tokenBuffer, tokentyper.tokenname)
  }

  /**
   * Method for activeToken.
   *
   * @param {Array} arr - the token package.
   * @returns {Array} - the tokenpackage.
   */
  getActiveToken (arr) {
    let currentindex = 0
    /**
     * Method to get the current active token.
     *
     * @returns {*} - the current active token.
     */
    arr.curr = function () { return arr[0] }
    /**
     * Method to come to next active token.
     *
     * @returns {*} - the next active token
     */
    arr.next = function () { return (++currentindex >= this.length) ? 'END' : this[currentindex] }
    /**
     * Method to come to previous active token.
     *
     * @returns {*} - the previous active token
     */
    arr.prev = function () {
      return (--currentindex < 0) ? 'END' : this[currentindex]
    }
    return arr
  }
}
