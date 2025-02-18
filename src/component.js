import { findDOM, compareTwoVdom } from "./react-dom/client";

export class Component {
  static isReactComponent = true;

  constructor(props) {
    this.props = props;
    this.state = {};
    // 每个更新器会保存一个组件类的实例
    this.updater = new Updater(this);
  }
  setState(partialState) {
    this.updater.addState(partialState);
  }

  forceUpdate() {
    console.log(this);
    // 先获取老的虚拟dom，再计算出新的虚拟dom，比较差异，最后更新真实dom
    let oldRenderVdom = this.oldRenderVdom;
    let newRenderVdom = this.render();
    // 获取老的真实dom
    const oldDOM = findDOM(oldRenderVdom);
    compareTwoVdom(oldDOM.parentNode, oldRenderVdom, newRenderVdom);
    // 更新后需要更新oldRenderVdom
    this.oldRenderVdom = newRenderVdom;
  }
}

class Updater {
  constructor(classInstance) {
    this.classInstance = classInstance;
    // 用来存放更新状态的队列
    this.pendingStates = [];
  }

  addState(partialState) {
    this.pendingStates.push(partialState);
    this.emitUpdate(); // 更新组件
  }

  emitUpdate() {
    this.updateComponent();
  }
  updateComponent() {
    // 获取等待生效的数组以及类的实例
    const { pendingStates, classInstance } = this;
    if (pendingStates.length > 0) {
      shouldUpdate(classInstance, this.getState());
    }
  }
  // 根据队列中的状态，生成新的状态
  getState() {
    const { pendingStates, classInstance } = this;
    let { state } = classInstance;
    pendingStates.forEach((nextState) => {
      state = { ...state, ...nextState };
    });
    pendingStates.length = 0;
    return state;
  }
}

function shouldUpdate(classInstance, nextState) {
  // 更新状态
  classInstance.state = nextState;
  // 重新渲染组件
  classInstance.forceUpdate();
}
