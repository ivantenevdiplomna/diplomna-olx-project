import "./Signin.css";
import SignUpForm from "../Sign-up-form/Sign-up-form.components";
import { Button } from "@chakra-ui/react";
import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Avatar,
  useDisclosure,
} from "@chakra-ui/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import Login from "./Login";

const Authentication = ({ ModalName }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  return (
    <div>
      <Button variant={"none"} onClick={onOpen}>
        {ModalName}
      </Button>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Avatar
              marginLeft={"8rem"}
              w={"7rem"}
              name="Oshigaki Kisame"
              src="https://images-platform.99static.com/Wz8uWM8Bxjb8cKkxi11G_6wcqpg=/1x1:960x960/500x500/top/smart/99designs-contests-attachments/78/78275/attachment_78275463"
            />
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Login />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "none",
              }}
              className="p-4 box mt-3 text-center"
            >
              Don't have an account? {<SignUpForm ModalName={"Signup"} />}
            </div>
          </ModalBody>
          <ModalFooter>
            QuickSale.com - <small>Braj verma</small>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default Authentication;
