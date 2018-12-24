import React, { Component } from 'react';
import { tokenizer, parser } from '../parser/reactionScriptParser';
import './editor.css'

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };
  }

  handleChange = (event) => {
    this.setState({value: event.target.value});
  }

  handleSubmit = () => {
    const tokens = tokenizer(this.state.value);
    const ast = parser(tokens);
    console.log(ast);
  }

  render() {
    return (
      <div id="editor">
        <h2>Write your app</h2>
        <textarea value={this.state.value} onChange={this.handleChange}></textarea>
        <button onClick={this.handleSubmit}>Parse</button>
      </div>
    );
  }
}

export default Editor;