const fs = require('fs');
const reactionScript = require('../parser/reactionScriptParser.js');

fs.readFile('test.txt', 'utf8', (err, contents) => {
    const tokens = reactionScript.tokenizer(contents);
    const ast = reactionScript.parser(tokens);
});