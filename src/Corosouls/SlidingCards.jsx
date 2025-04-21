import React, { Component } from "react";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Card, CardHeader, Box, CardFooter,Flex,Heading,Text,Image,Hide } from '@chakra-ui/react'
import { useState, useEffect } from "react";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { useSelector, useDispatch } from "react-redux";
import { store } from "../Redux/store";

import { getPostsAllCategory } from "../Redux/Products/Product.action";

export default function PauseOnHover(){
  
   const { loading, data } = useSelector((store) => store.product);
   const dispatch = useDispatch();
   //console.log(data);
   useEffect(() => {
     setTimeout(() => {
       dispatch(getPostsAllCategory());
     }, 2000);
   }, []);

    const settings = {
      accessibility:true,
      adaptiveHeight:false,
     touchMove:true,
      
      infinite: true,
      slidesToShow: 4,
      slidesToScroll: 1,
      autoplay: true,
      speed: 2000,
      autoplaySpeed: 2000,
      cssEase: "linear",
    };

    const navigate = useNavigate()
  

 

 

  const handleClick=()=>{
   
    navigate("/")
  }

    return (
      <Hide below="lg">
      <div style={{margin:"auto",marginBottom:"40px",marginTop:"-80px"}} >
        <h2 style={{fontSize:"25px",fontWeight:"bolder",marginLeft:"35px",marginBottom:"10px",textDecoration:"underline"}} >More on Cars</h2>
        <Carousel
          autoPlay
          infiniteLoop
          showStatus={false}
          showThumbs={false}
          interval={3000}
        >
          {data.map((item,i) => (
            <div key={i}>
              <Card onClick={handleClick} margin="20px" minH='20rem' maxW={{base:null,md:"15rem",lg:"18rem"}} id="productBody">
                <Box sx={{position:"absolute", marginLeft : "88%",color:"grey",marginTop:"5px",marginRight:"10px"}}></Box>
                <Image
                  height={150}
                  margin={"auto"}
                  src={item.image1}
                  alt={item.title}
                />
                <CardHeader>
                  <Flex spacing='0' flexWrap='wrap'>
                    <Flex flex='1' gap='0' alignItems='center' flexWrap='wrap'>
                      <Box>
                        <Heading size='md'>{item.price}</Heading>
                        <Text size="sm">{item.title}</Text>
                      </Box>
                    </Flex>
                  </Flex>
                </CardHeader>
                <CardFooter
                  justify='space-between'
                  flexWrap='wrap'
                  sx={{
                    fontSize:"12px"
                  }}
                >
                  <Text>{item.location}</Text>
                  <Text>{item.post_uploaded}</Text>
                </CardFooter>
              </Card>
            </div>
          ))}
        </Carousel>
      </div>
      </Hide>
    );
  }






  