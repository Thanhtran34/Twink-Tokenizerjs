/**
 * A class for tokentyper.
 *
 *@class Token
 */
export class TokenTyper {
  /**
   * Creates an instance of TokenTyper class.
   *
   * @param {string} tokenname - the name of the token type.
   * @param {string} regexp - the regular expression from the user.
   */
  constructor (tokenname, regexp) {
    this.tokenname = tokenname
    this.regexp = regexp
  }
}
