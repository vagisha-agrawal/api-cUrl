import React, { Component } from "react";
import { Button } from "react-bootstrap";

export default class reactPractice extends Component {
  constructor() {
    super();
    this.state = {
      btnValue: "Hi",
      putItems:"",
      count:0,
    };
  }

  myFunction = (message,msg) => {
    // message = typeof message === 'undefined' ? message : "hi";
    let a=[1,2,3,4,5]
    for(const arr of a){
      console.log(arr+"\n");
      // this.setState({arr},()=>console.log(this.state.arr+"\n"))
    }
  };

  putArray=(item,putItem=[])=>{
    putItem.push(item);
    return putItem;
    
    // let {count,putItems}=this.state;
    // let counts=count+1;
    // this.setState({count:counts,putItems:counts+" "+putItem},()=>console.log(putItems))
  }

  render() {
    let { btnValue } = this.state;
    // console.log(this.state.arr);
    return (
      <>
        <Button onClick={(e) => this.myFunction("hi","hello")}>{btnValue}</Button>
        <Button onClick={(e) => this.putArray("toy Car")}>Put item</Button>
      </>
    );
  }
}
