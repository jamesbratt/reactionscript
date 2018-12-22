const fs = require('fs');

const TYPE_STRING = 'stringLiteral';
const TYPE_NUMBER = 'numberLiteral';
const TYPE_FUNC = 'callExpression';
const TYPE_DECLARED_VAR = 'declaration';
const TYPE_REFERENCED_VAR = 'reference';

const CHAR_EQUALS = '=';
const CHAR_OPEN_PAREN = '(';
const CHAR_CLOSE_PAREN = ')';
const CHAR_OPEN_BRACE = '{';
const CHAR_CLOSE_BRACE = '}';
const CHAR_COLON = ':';
const CHAR_COMMA = ',';
const CHAR_SEMI_COLON = ';';

const SPECIAL_CHARS = [
    { '=': 'equals' },
    { '(': 'open paren' },
    { ')': 'close paren' },
    { '{': 'open brace' },
    { '}': 'close brace' },
    { ':': 'colon' },
    { ',': 'comma' },
    { ';': 'semi colon' },
];

const KNOWN_EXPRESSIONS = [
    'model',
    'collection',
    'display',
];

const generateTokens = (reactionScript) => {

    const castType = (value, tokens) => {

        let type = null;

        const isNotNumber = isNaN(value);
        const isStringLit = value.slice(-1) === '"' &&
        value.slice(0,1) === '"' ? true : false;

        if(KNOWN_EXPRESSIONS.indexOf(value) > -1) {
            type = TYPE_FUNC; 
        };

        if(!isNotNumber) {
            type = TYPE_NUMBER;
        };

        if(isNotNumber && isStringLit) {
            type = TYPE_STRING;

        } else if(!type) {

            const declaredVar = tokens.find((token) => {
                if(token.type === TYPE_DECLARED_VAR && token.value === value) {
                    return token;
                }
            });

            if(declaredVar) {
                type = TYPE_REFERENCED_VAR;
            } else {
                type = TYPE_DECLARED_VAR;
            }
        };

        if(type) {
            return { type, value };
        } else {
            throw TypeError(`${value} is not recognised as a valid type`);
        };
    };

    const scriptStripped = reactionScript.replace(/\s/g, '');

    const tokens = [];
    let value = [];

    for (let index = 0; index < scriptStripped.length; index++) {
        const char = scriptStripped.charAt(index);
        const specialCharArr = SPECIAL_CHARS.map(
            specialChar => Object.keys(specialChar)[0]
        );
        if(specialCharArr.indexOf(char) > -1) {
            if(value.length > 0) {
                const typeCastValue = castType(
                    value.join(''),
                    tokens
                );
                tokens.push(typeCastValue);
                value = [];
            }
            tokens.push({
                type: SPECIAL_CHARS.find(
                    specialChar => specialChar[char]
                )[char],
                value: char
            });
        } else {
            value.push(char);
        }
    }
    return tokens;
};

const generateAbstractSyntaxTree = (tokens) => {

    const specialCharArr = SPECIAL_CHARS.map(
        specialChar => Object.keys(specialChar)[0]
    );

    let currentTokenIndex = 0;

    const updateIndex = () => {
        ++currentTokenIndex;
    };

    const tokenWalk = () => {
        let token = tokens[currentTokenIndex];
        let node = {};

        if(specialCharArr.indexOf(token.value) > -1) {
            updateIndex();
            token = tokens[currentTokenIndex];
        }

        if(token.type === TYPE_DECLARED_VAR) {
            node = {
                type: token.type,
                name: token.value,
                value: [],
            }

            updateIndex();

            if(tokens[currentTokenIndex].value === CHAR_EQUALS) {
                node.value.push(
                    tokenWalk()
                );
            } else {
                throw SyntaxError(`Expected token "${CHAR_EQUALS}"`);
            }
            
        };

        if(token.type === TYPE_FUNC) {
            node = {
                type: token.type,
                name: token.value,
                params: [],
                body: [],
            }

            updateIndex();

            if(tokens[currentTokenIndex].value === CHAR_OPEN_PAREN) {
                while(token.value !== CHAR_CLOSE_PAREN) {
                    node.params.push(
                        tokenWalk()
                    );
                    token = tokens[currentTokenIndex];
                }
            } else {
                throw SyntaxError(`Expected token "${CHAR_OPEN_PAREN}"`);
            }
        };

        if(token.type === TYPE_STRING) {
            node = {
                type: token.type,
                value: token.value,
            }
        };

        if(token.type === TYPE_NUMBER) {
            node = {
                type: token.type,
                value: token.value,
            }
        };

        if(token.type === TYPE_REFERENCED_VAR) {
            node = {
                type: token.type,
                name: token.value,
            }   
        };

        updateIndex();

        return node;
    };

    let ast = {
        type: 'program',
        body: [],
    };

    while (currentTokenIndex < tokens.length) {
        ast.body.push(tokenWalk());
    }

    return ast;
};

fs.readFile('test.txt', 'utf8', (err, contents) => {
    const tokens = generateTokens(contents);
    const ast = generateAbstractSyntaxTree(tokens);
});
