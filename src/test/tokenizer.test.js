import pkg from 'mocha'
import chai from 'chai'
import { TokenTyper } from '../TokenTyper.js'
import { Tokenizer } from '../Tokenizer.js'

const expect = chai.expect
const { describe, it } = pkg

describe('WORDANDDOTGRAMMAR', () => {
  it('Test word token', () => {
    const tokenizer = new Tokenizer('WORDANDDOTGRAMMAR', 'a')
    tokenizer.setRule(new TokenTyper('WORD', '^[a-zA-Z|äöåÄÖÅ]+$'))
    const tokens = tokenizer.runTokenizer()
    tokenizer.getActiveToken(tokens)
    const expected = { type: 'WORD', value: 'a', line: 1, col: 1 }
    expect(tokens.curr()).to.deep.equal(expected)
  })

  it('Test next active token', () => {
    const tokenizer = new Tokenizer('WORDANDDOTGRAMMAR', 'a aa')
    tokenizer.setRule(new TokenTyper('WORD', '^[a-zA-Z|äöåÄÖÅ]+$'))
    const tokens = tokenizer.runTokenizer()
    const expected = { type: 'WORD', value: 'aa', line: 1, col: 2 }
    tokenizer.getActiveToken(tokens)
    expect(tokens.next()).to.deep.equal(expected)
  })

  it('Test next next active token', () => {
    const tokenizer = new Tokenizer('WORDANDDOTGRAMMAR', 'a.b')
    tokenizer.setRule(new TokenTyper('WORD', '^[a-zA-Z|äöåÄÖÅ]+$'))
    tokenizer.setRule(new TokenTyper('DOT', '^\\.$'))
    const tokens = tokenizer.runTokenizer()
    const expected = { type: 'WORD', value: 'b', line: 1, col: 3 }
    tokenizer.getActiveToken(tokens)
    tokens.next()
    expect(tokens.next()).to.deep.equal(expected)
  })

  it('Test end of line', () => {
    const tokenizer = new Tokenizer('WORDANDDOTGRAMMAR', 'a.b')
    tokenizer.setRule(new TokenTyper('WORD', '^[a-zA-Z|äöåÄÖÅ]+$'))
    tokenizer.setRule(new TokenTyper('DOT', '^\\.$'))
    const tokens = tokenizer.runTokenizer()
    const expected = 'END'
    tokenizer.getActiveToken(tokens)
    tokens.next()
    tokens.next()
    expect(tokens.next()).to.deep.equal(expected)
  })

  it('Test current active token', () => {
    const tokenizer = new Tokenizer('WORDANDDOTGRAMMAR', 'aa.b')
    tokenizer.setRule(new TokenTyper('WORD', '^[a-zA-Z|äöåÄÖÅ]+$'))
    tokenizer.setRule(new TokenTyper('DOT', '^\\.$'))
    const tokens = tokenizer.runTokenizer()
    const expected = { type: 'WORD', value: 'aa', line: 1, col: 1 }
    tokenizer.getActiveToken(tokens)
    expect(tokens.curr()).to.deep.equal(expected)
  })

  it('Test previous active token if its is end', () => {
    const tokenizer = new Tokenizer('WORDANDDOTGRAMMAR', 'a')
    tokenizer.setRule(new TokenTyper('WORD', '^[a-zA-Z|äöåÄÖÅ]+$'))
    const tokens = tokenizer.runTokenizer()
    tokenizer.getActiveToken(tokens)
    const expected = 'END'
    expect(tokens.prev()).to.deep.equal(expected)
  })

  it('Test previous token', () => {
    const tokenizer = new Tokenizer('WORDANDDOTGRAMMAR', 'a b')
    tokenizer.setRule(new TokenTyper('WORD', '^[a-zA-Z|äöåÄÖÅ]+$'))
    const tokens = tokenizer.runTokenizer()
    tokenizer.getActiveToken(tokens)
    tokens.next()
    const expected = { type: 'WORD', value: 'a', line: 1, col: 1 }
    expect(tokens.prev()).to.deep.equal(expected)
  })
})

describe('ARITHMETICGRAMMAR', () => {
  it('Test number type of token', () => {
    const tokenizer = new Tokenizer('ARITHMETICGRAMMAR', '3')
    tokenizer.setRule(new TokenTyper('NUMBER', '^\\d+?\\.?\\d*$'))
    const tokens = tokenizer.runTokenizer()
    tokenizer.getActiveToken(tokens)
    const expected = { type: 'NUMBER', value: '3', line: 1, col: 1 }
    expect(tokens.curr()).to.deep.equal(expected)
  })

  it('Test float number type of token', () => {
    const tokenizer = new Tokenizer('ARITHMETICGRAMMAR', '3.14')
    tokenizer.setRule(new TokenTyper('NUMBER', '^\\d+?\\.?\\d*$'))
    const tokens = tokenizer.runTokenizer()
    tokenizer.getActiveToken(tokens)
    const expected = { type: 'NUMBER', value: '3.14', line: 1, col: 1 }
    expect(tokens.curr()).to.deep.equal(expected)
  })

  it('Test operator and number', () => {
    const tokenizer = new Tokenizer('ARITHMETICGRAMMAR', '3.14 + 54 * 4')
    tokenizer.setRule(new TokenTyper('NUMBER', '^\\d+?\\.?\\d*$'))
    tokenizer.setRule(new TokenTyper('ADD', '^\\+$'))
    tokenizer.setRule(new TokenTyper('MUL', '^\\*$'))
    const tokens = tokenizer.runTokenizer()
    tokenizer.getActiveToken(tokens)
    const expected = { type: 'NUMBER', value: '3.14', line: 1, col: 1 }
    expect(tokens.curr()).to.deep.equal(expected)
  })

  it('Test fourth next active token', () => {
    const tokenizer = new Tokenizer('ARITHMETICGRAMMAR', '3.14 + 54 * 4')
    tokenizer.setRule(new TokenTyper('NUMBER', '^\\d+?\\.?\\d*$'))
    tokenizer.setRule(new TokenTyper('ADD', '^\\+$'))
    tokenizer.setRule(new TokenTyper('MUL', '^\\*$'))
    const tokens = tokenizer.runTokenizer()
    tokenizer.getActiveToken(tokens)
    tokens.next()
    tokens.next()
    const expected = { type: 'MUL', value: '*', line: 1, col: 8 }
    expect(tokens.next()).to.deep.equal(expected)
  })

  it('Test next, prev and next active token', () => {
    const tokenizer = new Tokenizer('ARITHMETICGRAMMAR', '3.14 + 54 * 4')
    tokenizer.setRule(new TokenTyper('NUMBER', '^\\d+?\\.?\\d*$'))
    tokenizer.setRule(new TokenTyper('ADD', '^\\+$'))
    tokenizer.setRule(new TokenTyper('MUL', '^\\*$'))
    const tokens = tokenizer.runTokenizer()
    tokenizer.getActiveToken(tokens)
    tokens.next()
    tokens.prev()
    const expected = { type: 'ADD', value: '+', line: 1, col: 5 }
    expect(tokens.next()).to.deep.equal(expected)
  })
})

describe('FLOATANDINTEGER', () => {
  it('Test next integer token', () => {
    const tokenizer = new Tokenizer('FLOATANDINTEGER', '3.14 5')
    tokenizer.setRule(new TokenTyper('FLOAT', '^[-+]?[0-9]*\\.[0-9]*$'))
    tokenizer.setRule(new TokenTyper('INTEGER', '^\\d+$'))
    const tokens = tokenizer.runTokenizer()
    tokenizer.getActiveToken(tokens)
    const expected = { type: 'INTEGER', value: '5', line: 1, col: 5 }
    expect(tokens.next()).to.deep.equal(expected)
  })
})

describe('JAVACLASS', () => {
  it('Test java class token', () => {
    const tokenizer = new Tokenizer('PUBLIC CLASS', 'public class')
    tokenizer.setRule(new TokenTyper('PUBLIC CLASS', 'public class'))
    const tokens = tokenizer.runTokenizer()
    tokenizer.getActiveToken(tokens)
    const expected = { type: 'PUBLIC CLASS', value: 'public class', line: 1, col: 1 }
    expect(tokens.curr()).to.deep.equal(expected)
  })
})

describe('JAVASCRIPT', () => {
  it('Test javascript token', () => {
    const tokenizer = new Tokenizer('FUNCTION', 'function')
    tokenizer.setRule(new TokenTyper('FUNCTION', 'function'))
    const tokens = tokenizer.runTokenizer()
    tokenizer.getActiveToken(tokens)
    const expected = { type: 'FUNCTION', value: 'function', line: 1, col: 1 }
    expect(tokens.curr()).to.deep.equal(expected)
  })
})
