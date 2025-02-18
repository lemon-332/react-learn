import { REACT_ELEMENT } from "./constant";
import { wrapToVdom } from "./utils";
import { Component } from "./component";

function createElement(type, config, children) {
  let ref; // ref是用来引用此元素的
  let key; // key是用来标记一个父亲唯一的儿子的
  if (config) {
    delete config._owner;
    delete config._store;
    ref = config.ref;
    key = config.key;
    delete config.ref;
    delete config.key;
  }
  let props = { ...config };
  if (arguments.length > 3) {
    props.children = Array.prototype.slice
      .call(arguments, 2)
      .map((child) => wrapToVdom(child));
  } else if (arguments.length === 3) {
    props.children = wrapToVdom(children);
  }
  return {
    $$typeof: REACT_ELEMENT,
    type,
    props,
    ref,
    key,
  };
}

const React = {
  createElement,
  Component,
};

export default React;
