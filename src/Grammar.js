
/**
 * Grammar class to collect rules from user.
 *
 */
export class Grammar {
  /**
   * An instanceof the Grammar class.
   *
   */
  constructor () {
    this.tokenTypers = []
  }

  /**
   * Method to add new rule for tokenizer.
   *
   * @param {*} tokentyper - the name and regext of token from user.
   * @returns {Array} grammar - the tokentypers array.
   */
  addRule (tokentyper) {
    this.tokenTypers.push(tokentyper)
    return this.tokenTypers
  }

  /**
   * Method to check valid regex.
   *
   * @param {Array} tokentypers - an array of tokentyper.
   * @param {*} userinput - text from user.
   * @returns {*} boolean
   */
  findMatchningRule (tokentypers, userinput) {
    for (let i = 0; i < tokentypers.length; i++) {
      const reg = new RegExp(tokentypers[i].regexp)
      if (reg.test(userinput)) {
        return tokentypers[i]
      }
    }
    return undefined
  }

  /**
   * Method to check MaximalMunch.
   *
   * @param {Array} tokentypers - an array of tokentyper.
   * @param {*} userinput - text from user.
   * @returns {*} boolean
   */
  findMaxIndexAndRule (tokentypers, userinput) {
    let lastMatchingRule
    for (let i = 0; i < userinput.length; i++) {
      const tokentyper = this.findMatchningRule(tokentypers, userinput.substring(0, i + 1))
      if (tokentyper) {
        lastMatchingRule = tokentyper
      } else if (lastMatchingRule) {
        return { maxIndex: i, rule: lastMatchingRule }
      }
    }
    return lastMatchingRule ? { maxIndex: userinput.length, rule: lastMatchingRule } : undefined
  }
}
