import React from "react";
import { Box } from "@chakra-ui/react";
import Corosoul from "../../Corosouls/Corosoul";
import Corosoul2 from "../../Corosouls/Corosoul2";
import SlidingCards from "../../Corosouls/SlidingCards";

const Home = () => {
  return (
    <Box>
      <Corosoul />
      <Corosoul2 />
      <SlidingCards />
    </Box>
  );
};

export default Home; 