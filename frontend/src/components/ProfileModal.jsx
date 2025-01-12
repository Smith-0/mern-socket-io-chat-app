import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Avatar,
} from "@chakra-ui/react";
import { IoCloseSharp } from "react-icons/io5";

const ProfileModal = ({ isOpen, onClose, user, userType }) => {
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const [userInfo, setUserInfo] = useState({
    userName: user.name,
    phone_number: user.phone_number,
  });

  return (
    <>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <div className="flex flex-row justify-between">
              <div>Contact Info</div>

              <IoCloseSharp
                style={{ fontSize: "24px", cursor: "pointer" }}
                onClick={onClose}
              />
            </div>
          </ModalHeader>
          <ModalBody pb={6}>
            <div className="flex flex-col justify-center items-center">
              <div style={{ width: "200px", margin: "1rem auto 2rem auto" }}>
                <Avatar
                  name={user.name}
                  src={user.picture}
                  style={{ width: "200px", height: "200px" }}
                />
              </div>
              <div className="font-bold mb-2" style={{ fontSize: "20px" }}>
                {user.name}
              </div>
              <div>Ph. &nbsp;{user.phone_number}</div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
