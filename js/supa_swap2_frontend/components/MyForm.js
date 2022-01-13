import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

const Input = styled.input`
  font-size: 24px;
  padding: 20px;
  margin: 10px;
  color: white;
  background: black;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  ::placeholder {
    color: white;
  }
`

class MyForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {value: ''};
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event) {
      this.setState({value: event.target.value});
    }
  
    handleSubmit(event) {
      alert('A name was submitted: ' + this.state.value);
      event.preventDefault();
    }

  
    render() {
      return (
        <form onSubmit={this.handleSubmit}>
          <div>
          <label>
            <Input placeholder="Token amount" type="text" value={this.state.value} onChange={this.handleChange} />
          </label>
          </div>
          <input type="submit" value="Submit" />
        </form>
      );
    }
  }

  export default MyForm