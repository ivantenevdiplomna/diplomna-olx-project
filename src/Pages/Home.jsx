import React from 'react';
import SimpleSlider from "../Corosouls/Corosoul"
import SimpleSlider2 from "../Corosouls/Corosoul2"
import PauseOnHover from "../Corosouls/SlidingCards"
import AllProducts from '../components/AllProducts'

export default function Home(){

// setTimeout(function () {
//  document.querySelector(".home").innerHTML = null;
// }, 3000);

return (
  <div >
    <SimpleSlider />
    <AllProducts />
    <PauseOnHover />
    <SimpleSlider2 />
  </div>
);

}