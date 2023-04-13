import React from "react";
import "./Select.css";

const Select = (props) => {
  const selectProps = {
    ...props,
    options: null
  };
  return <select className="select" {...selectProps}>
    <option></option>
    {
      props.options?.map(item => (
        <option value={item.value} key={item.value}>{item.label}</option>
      ))
    }
  </select>
};

export default Select;
