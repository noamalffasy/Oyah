import * as React from "react";
import { Component } from "react";

class Loading extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="loading" />
                <style jsx>{`
                    @keyframes spinAround {
                      0% {
                        -webkit-transform: rotate(0);
                        transform: rotate(0);
                      }
                      100% {
                        -webkit-transform: rotate(359deg);
                        transform: rotate(359deg);
                      }
                    }

                    .loading {
                        content: "";
                        display: block;
                        position: relative;
                        height: 1.5rem;
                        width: 1.5rem;
                        border: 2px solid #dbdbdb;  
                        border-color: #cc0000;
                        border-radius: 290486px;
                        border-right-color: transparent;
                        border-top-color: transparent;
                        animation: spinAround .5s infinite linear;
                    }
                `}</style>
            </React.Fragment>
        );
    }
}

export default Loading;
