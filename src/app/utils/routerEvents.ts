import emitter from "tiny-emitter/instance";
import Router from "next/router";

var routerEvents = [
  "routeChangeStart",
  "routeChangeComplete",
  "routeChangeError",
  "beforeHistoryChange"
];

routerEvents.forEach(event => {
  Router["on" + event[0].toUpperCase() + event.slice(1)] = (...args) => {
    emitter.emit.bind(emitter, event).apply(null, args);
  };
});

export default emitter;
