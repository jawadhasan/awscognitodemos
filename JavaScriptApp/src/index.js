
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

//configure authentication with values from your instance
Auth.configure({
  userPoolId: 'eu-central-1_BGOou5Rwx',
  userPoolWebClientId: '6v3vnd7af1vou9a9gte9korn8q',
  oauth: {
    region: 'eu-central-1',
    domain: 'hexquote.auth.eu-central-1.amazoncognito.com',
    scope: ['email', 'openid', 'aws.cognito.signin.user.admin', 'profile'],
    redirectSignIn: 'https://cognito.awsclouddemos.com',
    redirectSignOut: 'https://cognito.awsclouddemos.com',

  // redirectSignIn: 'http://localhost:1234',
  // redirectSignOut: 'http://localhost:1234',
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
function displayObject(data, type) {
  let payload = data && (data.message || data.title || '');
  alert(payload, type || 'warning') 
}




function onLogout() {
  sessionStorage.clear();
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
  if (!user) {
      
      $('#username-placeholder').hide();
      $('#logout-button').hide();
      $('#secure-button').hide();
      $('#login-button').show();      
  }
  else {
    $('#username-placeholder').show();
    console.log('username', user.username);
    $('#username-placeholder').text(user.username);
    $('#logout-button').show();
    $('#secure-button').show();
    $('#login-button').hide();


  }
}


async function getCurrentUser() {
  try {
    let currentUser = await Auth.currentAuthenticatedUser();
    let jwt = currentUser.signInUserSession.getAccessToken().getJwtToken();
     
      console.log('async getCurrentUser', currentUser);
      console.log('jwt', jwt);
      sessionStorage.setItem('jwt', jwt);

      setUserState(currentUser)
      return currentUser
  }
  catch (err) {
    console.error(err);
    let data = {};
    data.message = err;
    data.title='Get Current User';
    displayObject(data, 'danger');     
    setUserState(null)   
  }
}


function makeAjaxRequest(httpMethod, url, data, async, cache) {

  let jwt = sessionStorage.getItem('jwt');
  console.log('jwt@session-storage:', jwt);

  if (typeof async == "undefined") async = true;
  if (typeof cache == "undefined") cache = false;

  var ajaxObject = $.ajax({
      type: httpMethod.toUpperCase(),
      url: url,
      data: data,
      datatype: 'json',
      async: async,
      cache: cache,
      beforeSend: function (request) {
          request.setRequestHeader("content-type", "application/json"),
          request.setRequestHeader('Authorization', `Bearer ${jwt}`);
      }
  });

  return ajaxObject;
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

  $('#secure-button').on('click', (e) => {       
   makeAjaxRequest('GET','https://rqjmvfm8l5.execute-api.eu-central-1.amazonaws.com/Prod/api/security/',null)
    .done(function(data){
      console.log(data);
       // clear the existing list
  $('#users .list li').remove();

  $.each(data.claims, function(index,claim) {
    $('#users .list').append('<li><span class="name">'+claim.claimType+ ' :::: ' + claim.claimValue  + '</span></li>')
  });
    }).fail(function(err){
      console.log(err)
      displayObject(err, 'danger');   
    })
  });

  //setup events
  document.addEventListener("DOMContentLoaded", appLoaded())
});

