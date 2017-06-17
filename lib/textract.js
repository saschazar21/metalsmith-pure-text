/**
 * Import necessary plugins
 */
const debug = require('debug')('metalsmith-pure-text');
const textract = require('textract');

/**
 * Tries to extract text from a given buffer
 * @param buffer The buffer containing the text source
 * @param name The file name or path of the file
 * @param opts The options object, containing options for textract
 * @param cb The callback function
 * @returns The callback function (error, text)
 */
function extractor(buffer, name, opts, cb) {
  debug(`Start: ${name}.`);
  // Check if options object is a function, then no options were provided
  // check if options is an object - otherwise set it to null
  const noOptions = typeof opts === 'function' && !cb;
  const callback = noOptions ? opts : cb;
  const options = typeof opts === 'object' && opts !== null ? opts : null;
  debug(`Options object is ${options ? '' : 'NOT '}present.`);

  // Throw error if 'callback' is no function type
  if (typeof callback !== 'function') {
    debug('Illegal callback parameter given!');
    throw new Error('No callback function present!');
  }

  try {
    debug('Trying to extract text...');
    return textract.fromBufferWithName(name, buffer, options, callback);
  } catch (e) {
    debug('Text extraction FAILED!');
    return callback(true, e.message || e);
  }
}

module.exports = extractor;
