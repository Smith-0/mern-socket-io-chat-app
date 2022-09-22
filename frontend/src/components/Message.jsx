import React, { useState } from "react";
import $ from "jquery";

const Message = ({ message, user, index }) => {
  let Style = "";

  // const [prevMessageType, setPrevMessageType] = useState("");

  // for (const classname in $(`span.message${index + 1}`).prev().prevObject[0]
  //   .classList) {
  //   if ($(`message${index}`).prev()[0].classList.hasOwnProperty(classname)) {
  //     $(`message${index}`).prev()[0].classList[classname] === "OTHER"
  //       ? setPrevMessageType("OTHER")
  //       : setPrevMessageType("CURRENT");
  //   }
  // }

  // console.log($(`span.message${index}`).prev().prevObject[0].classList);

  if (user === "CURRENT") {
    Style =
      "CURRENT bg-[#d9fdd3] w-fit px-3 py-1 mb-[2px] rounded-lg float-right max-w-[90%] ";
  } else if (user === "OTHER") {
    Style =
      "OTHER bg-white w-fit px-3 py-1 mb-[2px] rounded-lg float-left max-w-[90%] ";
  }

  // if (prevMessageType !== user) {
  //   Style = Style + "mb-10 mt-10 ";
  // }

  return (
    <div>
      <span className={Style + `message${index}`}>{message}</span>
    </div>
  );
};

export default Message;
