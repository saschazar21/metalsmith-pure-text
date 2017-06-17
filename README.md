# metalsmith-pure-text

A [Metalsmith](https://github.com/segmentio/metalsmith) plugin that extracts plain text without HTML tags, Markdown syntax, etc.  
It acts as a wrapper for [textract](https://github.com/dbashford/textract) and uses its capabilities for handling different file formats.

* Author: [Sascha Zarhuber](https://sascha.work)
* GitHub: [@saschazar21](https://github.com/saschazar21)
* Twitter: [@saschazar](https://twitter.com/saschazar21)
* Source: [https://github.com/saschazar21/metalsmith-pure-text](https://github.com/saschazar21/metalsmith-pure-text)
* Issues: [https://github.com/saschazar21/metalsmith-pure-text/issues](https://github.com/saschazar21/metalsmith-pure-text/issues)
* Releases: [https://github.com/saschazar21/metalsmith-pure-text/releases](https://github.com/saschazar21/metalsmith-pure-text/releases)

## Prerequisites

* [Node.js](https://nodejs.org/en/) >= v6
* [Metalsmith](https://github.com/segmentio/metalsmith)

## Installation
`npm install metalsmith-pure-text`

## Options
The plugin takes an object containing different textract options - please look them up at textracts [GitHub repository](https://github.com/dbashford/textract).  
Additionally, it can be configured to filter specific file suffixes by providing a `pattern` option:  

```JavaScript
{
  "pattern": "**/*.html"    // string for one pattern only, array for multiple patterns
}
```

## Usage
Usage is possible via [JavaScript API](https://github.com/segmentio/metalsmith#api) and via [Metalsmith CLI](https://github.com/segmentio/metalsmith#cli):

### JavaScript API
Pass the plugin to the Metalsmith instance using its `.use()` function:
```JavaScript
const metalsmith = require('metalsmith');
const pureText = require('metalsmith-pure-text');

metalsmith.use(pureText({
  pattern: ['**/*.html'],   // The globbing pattern you want to use. Single pattern also in array.
  preserveLineBreaks: true, // textract option: preserve line breaks in extracted text.
  // (...)
}));

```

### Metalsmith CLI
Similar to the JavaScript API, the plugin may be used as follows:
```JavaScript
{
  "plugins": {
    "metalsmith-pure-text": {
      "pattern": ["**/*.html"],
      "preserveLineBreaks": true
    }
  }
}
```

### Results
After the text extraction is done, the outcome is stored in the `text` property of the respective file object, so one may be using it in templates similar like this ([handlebars](https://github.com/wycats/handlebars.js)-example):

```HTML
So you want to see the pure text contents of your file?
Here they are:

<pre>
  {{text}}
</pre>
```

## Issues
Please report any bugs or issues to the [issues](https://github.com/saschazar21/metalsmith-pure-text/issues) section.

## Contribution
Contributors welcome!  
Please fork this repository, open a pull request and drop me a line on [twitter](https://twitter.com/saschazar/).

## Credits
* **@dbashford** for [textract](https://github.com/dbashford/textract)
* **@sindresorhus** for [multimatch](https://github.com/sindresorhus/multimatch)

## License
MIT

## Milestones
* Support caching
* Handle image data

## Changelog
* **v1.0.0** - Initial version
