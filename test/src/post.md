---
title: Post
author: Sascha Zarhuber
date: 2017-06-17
---

# metalsmith-pure-text

This is a metalsmith plugin I searched for a long time, however I haven't found anything similar to this. Therefore I came up with writing my own plugin.

## Functionality

The core functionality is to provide a sanitized string containing only text without any HTML tags or else. This is necessary for some actions like:

* SEO optimization
* actions, where an excerpt is simply not enough
* asynchronous tools like [Lunr.js](https://github.com/olivernn/lunr.js/)
* or others.

## Foundation

This plugin is based on [textract](https://github.com/dbashford/textract), therefore it should support multiple file formats.

## Suggestions?

Sure thing. Why don't you drop me a line or create a pull request?
