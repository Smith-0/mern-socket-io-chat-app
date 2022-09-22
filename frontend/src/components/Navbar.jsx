import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  useDisclosure,
  FormControl,
  Input,
  Button,
} from "@chakra-ui/react";
import {
  BsFillChatLeftTextFill,
  BsSearch,
  BsFillCameraFill,
} from "react-icons/bs";

import { TbLogout } from "react-icons/tb";

import { IoCloseSharp } from "react-icons/io5";

import { Menu, Transition, Dialog } from "@headlessui/react";

import NewChatOrGroupDrawer from "./NewChatOrGroupDrawer";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newChatOrGroup, setNewChatOrGroup] = useState("CHAT");

  let [isOpenProfileModal, setIsOpenProfileModal] = useState(false);

  function closeProfileModal() {
    setIsOpenProfileModal(false);
  }

  function openProfileModal() {
    setIsOpenProfileModal(true);
  }

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userData"))?.user;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      <Transition appear show={isOpenProfileModal} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeProfileModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    <div className="flex flex-row justify-between">
                      <div>Profile</div>

                      <IoCloseSharp
                        style={{ fontSize: "24px", cursor: "pointer" }}
                        onClick={closeProfileModal}
                      />
                    </div>
                  </Dialog.Title>
                  <div
                    className="flex flex-col justify-center items-center"
                    style={{ width: "200px", margin: "2rem auto" }}
                  >
                    {/* <input
                      type="file"
                      id="profile_pic"
                      name="profile_pic"
                      className="hidden"
                    /> */}
                    <label
                      htmlFor="profile_pic"
                      className="relative profile__pic__label"
                    >
                      {/* <div className="profile__pic__overlay"></div> */}
                      <BsFillCameraFill className="profile__pic__overlay__icon" />
                      <Avatar
                        bg="gray.300"
                        name={user?.name}
                        src={user?.picture}
                        style={{
                          width: "200px",
                          height: "200px",
                          cursor: "pointer",
                        }}
                      />
                    </label>
                    <div
                      className="font-bold mb-2 mt-10"
                      style={{ fontSize: "20px" }}
                    >
                      {user?.name}
                    </div>
                    <div>Ph. &nbsp;{user?.phone_number}</div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <div className="bg-[#f0f2f5] p-3 relative">
        <NewChatOrGroupDrawer
          isOpen={isOpen}
          onClose={onClose}
          type={newChatOrGroup}
        />
        <div className="flex flex-row justify-between items-center">
          <div
            className="flex flex-row items-center cursor-pointer"
            onClick={() => setIsOpenProfileModal(true)}
          >
            <Avatar
              bg="gray.300"
              size="md"
              name={user?.name}
              src={user?.picture}
              className="ml-2"
            />
            <div className="ml-8 font-medium">{user?.name}</div>
          </div>
          <div className="flex justify-around items-baseline">
            <BsFillChatLeftTextFill
              onClick={() => {
                setNewChatOrGroup("CHAT");
                onOpen();
              }}
              className="mr-7 text-[#54656f] text-xl cursor-pointer"
            />
            <TbLogout
              onClick={handleLogout}
              className="mr-7 text-[#54656f] text-[23px] cursor-pointer"
            />
            {/* <Menu as="div" className="relative inline-block text-left mx-2">
              <div>
                <Menu.Button className="">
                  <BsThreeDotsVertical className="mr-7 text-[#54656f] text-xl" />
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="origin-top-right right-0 mt-2 w-40 rounded-md shadow-md bg-white absolute z-50">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          type="button"
                          onClick={() => {
                            setNewChatOrGroup("GROUP");
                            onOpen();
                          }}
                          className={classNames(
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "block w-full text-left px-4 py-2 text-sm"
                          )}
                        >
                          New Group
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          type="button"
                          className={classNames(
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "block w-full text-left px-4 py-2 text-sm"
                          )}
                        >
                          Setting
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          type="button"
                          onClick={handleLogout}
                          className={classNames(
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "block w-full text-left px-4 py-2 text-sm"
                          )}
                        >
                          Logout
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu> */}
          </div>
        </div>
      </div>

      <Box py="0.5rem" px="1rem" className="border-y-[0.3px]">
        <BsSearch className="inline mr-5 cursor-pointer absolute left-6 top-[5.6rem] z-10 text-[#869096]" />
        <input
          type="text"
          className="bg-[#f0f2f5] rounded-lg w-[100%] px-12 py-1 outline-none"
          placeholder="Search User"
        />
      </Box>
    </>
  );
};

export default Navbar;
