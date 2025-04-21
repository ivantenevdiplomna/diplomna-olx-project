import React from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { Provider } from "react-redux";
import { store } from "./Redux/store";
import "./App.css";
import Footer from "./Pages/Footer/Footer";
import Navbar from "./Components/Navbar/Navbar";
import AllRouters from "./Components/AllRouters";
import { AuthContextProvider } from "./Components/Context/AuthContext";
import Banner from "./Components/Navbar/Banner/Banner";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "gray.50",
      },
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <AuthContextProvider>
          <Navbar />
          <Banner />
          <AllRouters />
          <Footer />
        </AuthContextProvider>
      </ChakraProvider>
    </Provider>
  );
}

export default App;
