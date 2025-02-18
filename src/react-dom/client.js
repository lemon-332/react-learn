import { REACT_TEXT } from "../constant";

function createRoot(container) {
  return new DOMRoot(container);
}

function updateProps(dom, oldProps, newProps) {
  for (let key in newProps) {
    if (key === "children") {
      continue; // children单独处理
    } else if (key === "style") {
      let styleObj = newProps[key];
      for (let styleName in styleObj) {
        dom.style[styleName] = styleObj[styleName];
      }
    } else if (/^on[A-Z].*/.test(key)) {
      dom[key.toLowerCase()] = newProps[key];
    } else {
      dom[key] = newProps[key]; // 其他属性直接赋值
    }
  }
  for (let key in oldProps) {
    if (!newProps.hasOwnProperty(key)) {
      dom[key] = null;
    }
  }
}

function reconcileChildren(childrenVdom, ParentDOM) {
  childrenVdom.forEach((child) => {
    mount(child, ParentDOM);
  });
}

function mountFunctionComponent(vdom) {
  const { type, props } = vdom;
  const renderVdom = type(props);
  // 将虚拟DOM挂载到实例上
  vdom.oldRenderVdom = renderVdom;
  return createDOM(renderVdom);
}

function mountClassComponent(vdom) {
  const { type, props } = vdom;
  const classInstance = new type(props);
  const renderVdom = classInstance.render();
  // 将虚拟DOM挂载到实例上
  classInstance.oldRenderVdom = renderVdom;
  return createDOM(renderVdom);
}

// 创建DOM节点
function createDOM(vdom) {
  // 获取虚拟DOM的类型和属性
  const { type, props } = vdom;
  let dom;
  // 如果类型是REACT_TEXT，则创建文本节点
  if (type === REACT_TEXT) {
    dom = document.createTextNode(props);
  } else if (typeof type === "function") {
    // 如果类型是函数组件，则调用函数组件，获取虚拟DOM,类本质也是函数
    if (type.isReactComponent) {
      // 如果是类组件，则调用render方法，获取虚拟DOM
      return mountClassComponent(vdom);
    }
    return mountFunctionComponent(vdom);
  } else {
    // 否则创建元素节点
    dom = document.createElement(type);
  }
  // 如果属性是对象
  if (typeof props === "object") {
    // 更新属性
    updateProps(dom, {}, props);
    // 如果有子节点
    if (props.children) {
      // 如果子节点是对象且有类型，则递归创建子节点
      if (typeof props.children === "object" && props.children.type) {
        mount(props.children, dom);
      } else if (Array.isArray(props.children)) {
        // 如果子节点是数组，则递归创建子节点
        reconcileChildren(props.children, dom);
      }
    }
  }
  vdom.realDOM = dom;
  // 返回创建的DOM节点
  return dom;
}

function mount(vdom, container) {
  // 传虚拟dom，返回真实dom
  const newDOM = createDOM(vdom);
  container.appendChild(newDOM);
}

class DOMRoot {
  constructor(container) {
    this.container = container;
  }
  render(vdom) {
    mount(vdom, this.container);
  }
}

const ReactDOM = {
  createRoot,
};

export function findDOM(vdom) {
  if (!vdom) return null; // 如果虚拟DOM不存在，则返回null
  return vdom.realDOM;
}

export function compareTwoVdom(parentNode, oldVdm, newVdom) {
  let oldDOM = findDOM(oldVdm);
  let newDOM = createDOM(newVdom);
  parentNode.replaceChild(newDOM, oldDOM);
}

export default ReactDOM;
