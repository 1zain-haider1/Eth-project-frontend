import React, { FC } from "react";
import "./input.css";

interface inputI {
  text:string;
  setValue:(value:string)=>void
}
const Input: FC <inputI> = (props:inputI) => {
  return (
    <>
      <input
        className="input-class"
        type="text"
        placeholder="Enter Name"
        onChange={(e: any) => props.setValue(e.target.value)}
        value={props.text}
        name="input"
      />
    </>
  );
};

export default Input;
