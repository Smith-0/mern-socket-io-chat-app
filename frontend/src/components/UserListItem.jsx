import React from "react";
import { Avatar } from "@chakra-ui/react";

const UserListItem = ({ user, onClickHandler }) => {
  return (
    <>
      <div
        onClick={() => onClickHandler(user)}
        className="hover:bg-gray-50 flex flex-row justify-start items-center px-[1.3rem] cursor-pointer"
      >
        <Avatar name={user?.name} src={user?.picture} />
        <div className="ml-3 pl-5 border-y-[0.2px] border-gray-200 flex-1 py-3">
          <div className="name font-semibold text-lg">{user?.name}</div>
          <div className="status text-sm text-gray-500">
            {user?.phone_number}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserListItem;
