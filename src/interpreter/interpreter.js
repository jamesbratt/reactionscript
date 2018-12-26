import { addModel, addElement } from '../actions'

let AST = null;

const constructModel = (model) => {
  const modelLiteral = {};
  const modelKey = model.name;

  model.value.params.forEach(property => {
    if(property.type === 'stringLiteral') {
      modelLiteral[property.name.replace('"','')] = null;
    } else {
      throw SyntaxError('Invalid argument for model call');
    }
  });

  addModel({key: modelKey, value: modelLiteral});
};

const interpretDisplay = (node) => {
  const modelReference = node.params[1].name;
  const uiElement = node.params[0].name;

  const model = AST.find(
    node => node.type === 'declaration' && node.name === modelReference
  );

  if(model) {
    constructModel(model);
  
    const elementLiteral = {
      elementType: uiElement,
      modelReference: model.name,
    };

    addElement(elementLiteral);

  } else {
    throw SyntaxError('No model defined for display');
  }

};

const findElementsToDisplay = (nodes) => {
  nodes.forEach(node => {
    if(node.type === 'callExpression' && node.name === 'display') {
      interpretDisplay(node);
    } else if(node.value) {
      findElementsToDisplay(node.value);
    }
  });
};

const interpreter = (ast) => {
  AST = ast.body;
  findElementsToDisplay(ast.body);
};

export default interpreter;