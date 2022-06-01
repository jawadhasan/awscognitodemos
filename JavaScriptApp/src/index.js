// import another component
import main from './main';

//jquery setup
import "./import-jquery.js";

//bootstrap and fontawsome
import "bootstrap/dist/css/bootstrap.css";
import "@fortawesome/fontawesome-free/css/all.css";


// Import all plugins
import * as bootstrap from 'bootstrap';

// Or import only needed plugins
//import { Tooltip as Tooltip, Toast as Toast, Popover as Popover } from 'bootstrap';

import './resources/bootstrap.united.css';


main();

$(function() {
  
  console.log('ready function in index.js');

  //button click handlers

  $('#lnkTest').on('click', (e) => {
   alert('test clicked!');
});

  });