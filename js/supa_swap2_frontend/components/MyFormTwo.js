import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

class MyFormTwo extends React.Component {
    constructor(props) {
      super(props);
      this.state = {value: 'send'};

      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event) {
      this.setState({value: event.target.value});
    }
  
    handleSubmit(event) {
      alert('You have chosen: ' + this.state.value);
      event.preventDefault();
    }
  
    render() {
      return (
        <form onSubmit={this.handleSubmit}>
          <label>
            <select value={this.state.value} onChange={this.handleChange}>
              <option value="send">Send</option>
              <option value="recieve">Recieve</option>
            </select>
          </label>
          <input type="submit" value="Submit" />
        </form>
      );
    }
  }

  export default MyFormTwo