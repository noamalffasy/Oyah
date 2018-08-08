import * as React from "react";
import { Component } from "react";

class TwitterLogo extends Component {
  render() {
    return (
      <svg
        {...this.props}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 400 400"
      >
        <path
          fill="rgb(90, 164, 235)"
          d="m126.348557,361.292908c149.811874,0 231.752701,-124.118103 231.752701,-231.752716c0,-3.525352 0,-7.034843 -0.23822,-10.52845a165.723663,165.723663 0 0 0 40.636932,-42.161354a162.579422,162.579422 0 0 1 -46.782471,12.815163a81.734352,81.734352 0 0 0 35.809387,-45.051563a163.230499,163.230499 0 0 1 -51.721161,19.770603a81.527908,81.527908 0 0 0 -138.807083,74.286613a231.244522,231.244522 0 0 1 -167.867441,-85.100899a81.512032,81.512032 0 0 0 25.217432,108.730324a80.84507,80.84507 0 0 1 -36.96863,-10.194916c0,0.333466 0,0.682831 0,1.032166a81.48027,81.48027 0 0 0 65.346193,79.844635a81.321472,81.321472 0 0 1 -36.778084,1.397461a81.543785,81.543785 0 0 0 76.096992,56.564545a163.436935,163.436935 0 0 1 -101.155626,34.936005a165.80307,165.80307 0 0 1 -19.389477,-1.17514a230.593475,230.593475 0 0 0 124.848555,36.523987"
        />
      </svg>
    );
  }
}

export default TwitterLogo;