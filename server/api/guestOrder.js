import {useDeskreeForGuest} from "~/composables/UseDeskree.js"


let lastLoginTime = undefined
let accessToken = 0;
let refreshToken = '';

function authUsingMail (){

}
function authUsingRefreshToken (){

}

export default defineEventHandler( async(event) => {
    const Deskree = useDeskreeForGuest();
    console.log('Deskree: ', Deskree);

    const request = await readBody(event)
    const requestType = request.requestType
    console.log('requestType: ', requestType);
    
    if(requestType === "getAccessToken"){return accessToken}
   else if(requestType === "updateAccessToken"){return accessToken};

    
    
  })