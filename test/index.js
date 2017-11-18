/* global describe */
/* global it */
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

/**
 * Import necessary modules
 */
const Metalsmith = require('metalsmith');
const assert = require('chai').assert;
const debug = require('debug')('metalsmith-pure-text');
const fs = require('fs');
const layouts = require('metalsmith-layouts');
const markdown = require('metalsmith-markdown');
const path = require('path');

const pureText = require('../index');

function buildMetalsmith(pureTextOptions) {
  const metalsmith = Metalsmith(__dirname)
  .source('./src')
  .destination('./out')
  .use(pureText(pureTextOptions))
  .use(markdown())
  .use(layouts({
    engine: 'handlebars',
    directory: '_layouts',
    default: 'default.hbs',
    pattern: ['**/*.html'],
    rename: true,
  }));
  return metalsmith;
}

describe('Test #1', function processMetalsmith() {
  this.timeout(5000);
  it('should build Metalsmith without any error', (done) => {
    const metalsmith = buildMetalsmith({
      pattern: ['**/*.md'],
      preserveLineBreaks: true,
    });

    metalsmith.build((err) => {
      if (err) {
        debug(`Error: ${err.message || err}`);
        return done(err);
      }

      debug('Demo project built successfully.');
      return done();
    });
  });

  it('should process markdown files', (done) => {
    debug('Now reading post.html');
    return fs.readFile(path.resolve(__dirname, './out/post.html'), 'utf8', (error, text) => {
      if (text && text.length > 0) {
        return done();
      }
      return done(error || new Error('No text was extracted.'));
    });
  });

  it('should not process HTML files', (done) => {
    debug('Now reading index.html...');
    return fs.readFile(path.resolve(__dirname, './out/index.html'), 'utf8', (error, text) => {
      if (error) {
        return done(error);
      }

      // Filter new lines, as they also count as character
      const filteredNewLines = text.replace('\n', '');
      if (filteredNewLines.length > 0) {
        debug(text.length);
        return done(new Error('index.html: there should not be any text.'));
      }
      return done();
    });
  });
});

/* ----- Test section 2 ----- */

describe('Test #2', function processMetalsmith() {
  this.timeout(5000);
  it('should build Metalsmith without any error', (done) => {
    const metalsmith = buildMetalsmith({
      pattern: ['**/*.html'],    // this time processing only HTML files
      upperCase: true,
      preserveLineBreaks: true,
    });

    metalsmith.build((err) => {
      if (err) {
        debug(`Error: ${err.message || err}`);
        return done(err);
      }

      debug('Demo project built successfully.');
      return done();
    });
  });

  it('should not process markdown files', (done) => {
    debug('Now reading post.html...');
    return fs.readFile(path.resolve(__dirname, './out/post.html'), 'utf8', (error, text) => {
      if (error) {
        return done(error);
      }

      // Filter new lines, as they also count as character
      const filteredNewLines = text.replace('\n', '');
      if (filteredNewLines.length > 0) {
        debug(text.length);
        return done(new Error('post.html: there should not be any text.'));
      }
      return done();
    });
  });

  it('should transform text to upper case in HTML files', (done) => {
    debug('Now reading index.html...');
    return fs.readFile(path.resolve(__dirname, './out/index.html'), 'utf8', (error, text) => {
      if (error) {
        return done(error);
      }
      assert.typeOf(text, 'string', 'Text is a string.');
      assert.equal(text, text.toUpperCase(), 'Text is in upper case.');
      assert.isAbove(text.length, 20, 'Text is longer than 20 characters');
      return done();
    });
  });
});

/* ----- Test section 3 ----- */

describe('Test #3', function processMetalsmith() {
  this.timeout(5000);
  it('should fail to build Metalsmith', (done) => {
    const config = {
      pattern: ['**/*.html'],    // this time processing only HTML files
      upperCase: true,           // configuration is malformed, only one
      lowerCase: true,           // property is allowed here.
      preserveLineBreaks: true,
    };
    assert.throws(() => buildMetalsmith(config), 'Please provide only one property: upperCase OR lowerCase!');

    return done();
  });
});

/* ----- Test section 4 ----- */

describe('Test #4', function processMetalsmith() {
  this.timeout(5000);
  it('should extract text as base64-encoded string', (done) => {
    const base64regex = /^[a-z0-9+\/]+\=*$/igm; // base64 allowed characters; no space, not hyphens, no umlauts whatsoever...
    const config = {
      pattern: ['**/*.html'],
      encoding: 'base64',
    };
    const metal = buildMetalsmith(config);

    const openFile = () => fs.readFile(path.resolve(__dirname, './out/index.html'), 'utf8', (err, text) => {
      if (base64regex.test(text)) {
        return done();
      }
      return done(new Error('No base64 encoded text!'));
    });

    metal.build((err) => {
      if (err) {
        return done(err);
      }
      return openFile();
    });
  });
});
