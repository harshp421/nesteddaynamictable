import React from "react";

const Wrapper = (props: any) => {
  return (
    <>
      <div className={props.class}>{props.children}</div>
    </>
  );
};

export default Wrapper;
