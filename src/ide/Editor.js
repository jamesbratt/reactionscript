import React, { Component } from 'react';
import { connect } from 'react-redux'
import { tokenizer, parser } from '../parser/reactionScriptParser';
import interpreter from '../interpreter/interpreter';
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
    interpreter(ast);
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

export default connect()(Editor);