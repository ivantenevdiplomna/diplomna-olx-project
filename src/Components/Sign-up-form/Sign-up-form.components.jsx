import React, { useState } from "react";
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
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  useToast,
  Button
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Authentication from "../Authentication/Sign-in.component";

const SignUpForm = ({ModalName}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        name,
        email,
        password,
        phoneNumber
      });

      if (response.data.token) {
        toast({
          position: "bottom-center",
          render: () => (
            <Flex
              color="white"
              p={"10px"}
              bgColor="green.400"
              borderRadius={"15px"}
            >
              <CheckCircleIcon w={30} h={30} />
              <Text size="lg" ml="15px">
                You are Successfully Registered
              </Text>
            </Flex>
          ),
        });
        navigate("/login");
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        position: "bottom-center",
        render: () => (
          <Flex
            color="white"
            borderRadius={"15px"}
            p={"10px"}
            bgColor="red"
            alignItems={"center"}
          >
            <WarningIcon w={30} h={30} />
            <Text size="lg" ml="15px">
              {error.response?.data?.message || 'Error during registration'}
            </Text>
          </Flex>
        ),
      });
    }
  };

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
            <Box m="auto" height={"auto"} borderRadius="15px">
              <Text
                fontSize={"18px"}
                fontFamily={"sans-serif"}
                pt={4}
                borderBottom={"1px solid gainsboro"}
                pl={8}
                pb={4}
                fontWeight="semibold"
              >
                Register Now
              </Text>
              <Box p={8}>
                <FormControl isRequired>
                  <FormLabel fontWeight={"normal"}>Name</FormLabel>
                  <Input
                    placeholder="Enter Full Name"
                    variant="none"
                    border={"1px solid gainsboro"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </FormControl>

                <FormControl mt={8} isRequired>
                  <FormLabel fontWeight={"normal"}>Email address</FormLabel>
                  <Input
                    type="email"
                    placeholder="Enter Email Address"
                    variant="none"
                    border={"1px solid gainsboro"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormControl>

                <FormControl mt={8} isRequired>
                  <FormLabel fontWeight={"normal"}>Password</FormLabel>
                  <Input
                    type="password"
                    placeholder="Enter Password"
                    variant="none"
                    border={"1px solid gainsboro"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FormControl>

                <FormControl mt={8}>
                  <FormLabel fontWeight={"normal"}>Phone Number</FormLabel>
                  <Input
                    type="tel"
                    placeholder="Enter Phone Number"
                    variant="none"
                    border={"1px solid gainsboro"}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </FormControl>

                <Flex align={"center"} fontSize={"sm"} mt={7} fontFamily="sans-serif">
                  Already Registered{" "}
                  <span
                    style={{
                      color: "#FF3E6C",
                      fontWeight: "semibold",
                      marginLeft: "10px",
                    }}
                  >
                    <Authentication
                      ModalName={"Login Now"}
                      onClick={onClose}
                    />
                  </span>
                </Flex>

                <Button
                  mt={8}
                  colorScheme="blue"
                  width={"100%"}
                  bg="#FF3E6C"
                  color="white"
                  _hover={{
                    bg: "#FF3E6C",
                  }}
                  variant={"none"}
                  onClick={handleSubmit}
                >
                  REGISTER NOW
                </Button>
              </Box>
            </Box>
          </ModalBody>
          <ModalFooter>QuickSale.com</ModalFooter>
        </ModalContent>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default SignUpForm;