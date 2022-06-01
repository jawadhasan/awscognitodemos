
//for cognito and parcel to work
import 'regenerator-runtime/runtime'

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


//Cognito
import { Auth } from 'aws-amplify'

//configure authentication
Auth.configure({
  userPoolId: 'eu-central-1_BGOou5Rwx',
  userPoolWebClientId: '6v3vnd7af1vou9a9gte9korn8q',
  oauth: {
    region: 'eu-central-1',
    domain: 'hexquote.auth.eu-central-1.amazoncognito.com',
    scope: ['email', 'openid', 'aws.cognito.signin.user.admin', 'profile'],
    redirectSignIn: 'http://localhost:1234',
    redirectSignOut: 'http://localhost:1234',
    responseType: 'code' // 'code' or 'token', note that REFRESH token will only be generated when the responseType is code
  }
})

// main();



function alert(message, type) {
  var wrapper = document.createElement('div')
  wrapper.innerHTML = '<div class="alert alert-' + type + ' alert-dismissible" role="alert">' + message + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'

  var alertPlaceholder = document.getElementById('liveAlertPlaceholder')
  alertPlaceholder.append(wrapper)
}
function displayObject(data) {


  let payload = data && (data.message || data.title || '');
  alert(payload, 'warning')

  // Swal.fire({
  //     title: data && (data.message || data.title || ''),
  //     html: `<div class="text-danger" style="text-align:left">  ${JSON.stringify(data || {}, null, 6)
  //         .replace(/\n( *)/g, function (match, p1) {
  //             return '<br>' + '&nbsp;'.repeat(p1.length);
  //         })}</div>`
  // })
}




function onLogout() {

  Auth.signOut().then(result => {
      this.setUserState(null);
  }).catch(err => {
      this.displayObject(err)
  })
}
function onHostedUISignin() {
  Auth.federatedSignIn().then(result => {
    displayObject(result)
  }).catch((err) => {
    displayObject(err)
  })
}




function setUserState(user) {
  var usernamePlaceholder = document.getElementById('username-placeholder');
  var loginButton = document.getElementById('login-button');
  var logoutButton = document.getElementById('logout-button');
  if (!user) {
      usernamePlaceholder.innerHTML = ''
      usernamePlaceholder.style.display = 'none'
      loginButton.style.display = 'block'
      logoutButton.style.display = 'none'
  }
  else {
      usernamePlaceholder.innerHTML = user.username
      usernamePlaceholder.style.display = 'block'
      loginButton.style.display = 'none'
      logoutButton.style.display = 'block'
  }
}


async function getCurrentUser() {
  try {
      let currentUser = await Auth.currentAuthenticatedUser();
      console.log('async getCurrentUser', currentUser);

      setUserState(currentUser)
      return currentUser
  }
  catch (err) {
    console.error(err);
    let data = {};
    data.message = err;
    data.title='Cognito';
    displayObject(data);     
    setUserState(null)   
  }
}


async function appLoaded() {

  await getCurrentUser();
  console.log('async appLoaded');
}



$(function () {

  console.log('ready function in index.js');

  //button click handlers
 
  $('#login-button').on('click', (e) => {   
    onHostedUISignin();
  });

  $('#logout-button').on('click', (e) => {   
    onLogout();
  });


  

  //setup events
  document.addEventListener("DOMContentLoaded", appLoaded())
});

