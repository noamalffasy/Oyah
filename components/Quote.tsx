import * as React from "react";
import { Component } from "react";

class Quote extends Component {
  render() {
    return (
      <div className="Quote">
        <blockquote className="blockquote text-center">
          <p className="mb-0">Respect your elders</p>
          <footer className="blockquote-footer">
            <cite title="Source Title">Chillindude</cite>
          </footer>
        </blockquote>
      </div>
    );
  }
}

export default Quote;
