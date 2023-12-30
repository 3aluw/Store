import {useDeskreeForGuest} from "~/composables/UseDeskree.js"
const Deskree = useDeskreeForGuest();

let accessTokenTime;
let accessToken ;
let refreshToken;

async function loginUsingMail (){
  console.log("login called");
  const res = await  Deskree.guestUserAuth.authUsingMail({email:"moussa@gmail.com",password:"0123456"})
  accessToken = res.accessToken
  refreshToken = res.refreshToken
  accessTokenTime = new Date().getTime()
}

async function authUsingRefreshToken (){
   const newAccessToken = await Deskree.guestUserAuth.authUsingRefreshToken(refreshToken)
   accessToken = newAccessToken;
}
export default defineEventHandler( async(event) => {  

 console.log("accessToken",accessToken);

    if(!accessToken) {
    await  loginUsingMail()
    }

    if(new Date().getTime() - accessTokenTime < 3000000){
      await authUsingRefreshToken()
    } 
    return;

    //handle the request from the client
    const request = await readBody(event)
    request.user.accessToken = accessToken ;
    return await Deskree.placeOrders(request)


  })

  /*
  check if the accessToken is persisted
  find a way to get orders value from allSettled
  */ 