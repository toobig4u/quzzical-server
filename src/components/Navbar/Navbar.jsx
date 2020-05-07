import React, { Component } from "react";

class Navbar extends Component {
  render() {
    return (
      <div className="navbar shadow-4">
        <h4
          style={{
            marginLeft: "auto",
            marginRight: "auto",
            fontWeight: "bold"
          }}
          align="center"
        >
          Quizzical
        </h4>
      </div>
    );
  }
}

export default Navbar;
