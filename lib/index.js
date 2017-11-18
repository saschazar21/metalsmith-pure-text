/**
 * Import necessary plugins
 */
const debug = require('debug')('metalsmith-pure-text');
const multimatch = require('multimatch');

const textract = require('./textract');

/**
 * Checks if file is matching the provided globbing pattern
 * @param file The file path
 * @param pattern The globbing pattern array
 * @returns Returns true, if match succeeded and false, if match failed
 */
function checkPattern(file, pattern) {
  const match = multimatch(file, pattern);
  return match.length > 0;
}

/**
 * The main function, returns pure text of each matching file
 * @param options The options object based on Metalsmith CLI or API configuration
 * @returns The Metalsmith function to actually do the magic
 *    @param files The files object, containing metadata for all source files
 *    @param metalsmith The Metalsmith instance object
 *    @param done The callback function
 */
function metalsmithPureText(options) {
  const opts = typeof options === 'object' ? options : null;
  let encoding = null;      // may be set to base64 or html
  let pattern = ['**/*'];   // match all files by default
  let lowerCase = false;
  let upperCase = false;

  if (Object.prototype.hasOwnProperty.call(opts, 'pattern')) {
    pattern = Array.isArray(opts.pattern) ? opts.pattern : [opts.pattern];
    delete opts.pattern;
  }

  if (Object.prototype.hasOwnProperty.call(opts, 'lowerCase')
      || Object.prototype.hasOwnProperty.call(opts, 'upperCase')) {
    if (!!opts.lowerCase && !!opts.upperCase) {
      throw new Error('Please provide only one property: upperCase OR lowerCase!');
    }
    if (opts.lowerCase) {
      lowerCase = true;
      delete opts.lowerCase;
    }
    if (opts.upperCase) {
      upperCase = true;
      delete opts.upperCase;
    }
  }

  if (Object.prototype.hasOwnProperty.call(opts, 'encoding')) {
    if (opts.encoding.toLowerCase() === 'base64') {
      encoding = 'base64';
    } else if (opts.encoding.toLowerCase() === 'html') {
      encoding = 'html';
    } else {
      throw new Error('Encoding: please provide either "html", "base64" or leave out property.');
    }
  }

  return function handlePlugin(files, metalsmith, done) {
    // Handle each file in the files object
    Object.keys(files).forEach((file) => {
      // Don't process file, if file path doesn't match the pattern or file is empty
      if (!checkPattern(file, pattern) || !files[file].contents) {
        return false;
      }

      debug(`Currently processing: ${file}`);
      const currentFile = files[file];
      const contents = currentFile.contents;

      // Apply magic
      return textract(contents, file, opts, (error, text) => {
        if (error) {
          debug(`ERROR: ${error.message || error}`);
          throw new Error(error.message || error);
        }
        debug(`Successfully extracted text: ${file}`);

        // Trim text to remove whitespace before and after text and every new line
        const extracted = text.trim().replace(/^\s/gm, '');
        // Modify text based on upperCase & lowerCase options
        currentFile.text = lowerCase ? extracted.toLowerCase() : extracted;
        currentFile.text = upperCase ? extracted.toUpperCase() : currentFile.text;
        // If encoding was set, encode accordingly
        if (encoding) {
          if (encoding === 'base64') {
            currentFile.text = new Buffer(currentFile.text).toString('base64');
          }
          if (encoding === 'html') {
            currentFile.text = encodeURIComponent(currentFile.text);
          }
        }
        return done();
      });
    });
  };
}

module.exports = metalsmithPureText;
