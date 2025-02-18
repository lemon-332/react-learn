import React from "./react";
import ReactDOM from "./react-dom/client";

// React.createElement 等价于下面，就是类似于jsx语法糖，生成的main.js，中如在浏览器中打开
// 就会自动执行React.createElement，生成虚拟dom
// let element = (
//   <div className="title" style={{ color: "red" }}>
//     <span>hello</span>
//   </div>
// );

// let hh = React.createElement(
//   "div",
//   { className: "title", style: { color: "red" } },
//   "haha"
// );
// console.log(hh);

function FunctionComponent(props) {
  return (
    <div className="title" style={{ color: "red" }}>
      <span>{props.title}</span>
    </div>
  );
}

class ClassComponent extends React.Component {
  constructor(props) {
    super(props); // 在这里调用父类Component的构造函数，this.props=props
    this.state = {
      count: 0,
    };
  }
  // 除构造函数外不能直接修改this.state,必须通过setState方法
  // 因为setState会触发render方法，重新渲染组件
  render() {
    return (
      <div className="title" style={{ color: "red" }}>
        <p>{this.state.count}</p>
        <p>{this.props.title}</p>
        <button
          onClick={() => this.setState({ count: this.state.count + 1 })}
        >444</button>
      </div>
    );
  }
}
// let element = <FunctionComponent title="wo33rld" />;
// let element = ReactDOM.createElement(FunctionComponent, { title: "world" }); // 等价于上面，会转化成这种

let element = <ClassComponent title="wo33r435ld" />;
console.log(element);

// ReactDOM.createRoot(document.getElementById("root")).render(element);
ReactDOM.createRoot(document.getElementById("root")).render(element);
