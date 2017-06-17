/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

/**
 * Import necessary modules
 */
const Metalsmith = require('metalsmith');
const debug = require('debug')('metalsmith-pure-text');
const fs = require('fs');
const layouts = require('metalsmith-layouts');
const markdown = require('metalsmith-markdown');
const path = require('path');

const pureText = require('../index');

before('Build Metalsmith demo project', function setupTest(done) {
  this.timeout(5000);
  const metalsmith = Metalsmith(__dirname)
  .source('./src')
  .destination('./out')
  .use(pureText({
    pattern: ['**/*.md'],
    preserveLineBreaks: true,
  }))
  .use(markdown())
  .use(layouts({
    engine: 'handlebars',
    directory: '_layouts',
    default: 'default.hbs',
    pattern: ['**/*.html'],
    rename: true,
  }));

  metalsmith.build((err) => {
    if (err) {
      debug(`Error: ${err.message || err}`);
      return done(err);
    }

    debug('Demo project built successfully.');
    return done();
  });
});

describe('Test #1', function processMetalsmith() {
  this.timeout(5000);

  it('should process markdown files', function handleMarkdownOnly(done) {
    return fs.readFile(path.resolve(__dirname, './out/post.html'), 'utf8', (error, text) => {
      if (text && text.length > 0) {
        return done();
      }
      return done(error || new Error('No text was extracted.'));
    });
  });

  it('should not process HTML files', function dontHandleHTML(done) {
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
