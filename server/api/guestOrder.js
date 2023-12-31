import {useDeskreeForGuest} from "~/composables/UseDeskree.js"
const Deskree = useDeskreeForGuest();
let loginTime;
let accessTokenTime;
let accessToken ;
let refreshToken;

async function loginUsingMail (){
  //if the login isn't old (less than 15 mins) don't login : it is expected to be a backend error
  if(new Date().getTime() - loginTime < 900000) return false;
  
  loginTime = new Date().getTime();
  try{
  const res = await  Deskree.guestUserAuth.authUsingMail({email:"moussa@gmail.com",password:"0123456"})
  accessToken = res.accessToken
  refreshToken = res.refreshToken
  accessTokenTime = new Date().getTime()}
  catch{
    return false
  }

}

async function authUsingRefreshToken (){
  if(!refreshToken) return false
  try{
     const newAccessToken = await Deskree.guestUserAuth.authUsingRefreshToken(refreshToken)
   accessToken = newAccessToken;
   accessTokenTime = new Date().getTime();
  }
   catch(err){
    return false
   }
}

const obtainNewAccessToken = async()=>{
      //try refreshToken
      const res = await authUsingRefreshToken()
      if(!res) {
       //if refreshToken failed try mail login
     const loginRes =  loginUsingMail();
     //if failed return false
        if(!loginRes) return false
     }
     return true
}
export default defineEventHandler( async(event) => {  

    if(new Date().getTime() - accessTokenTime < 3000000 || !accessToken) await obtainNewAccessToken()

    

     //handle the request from the client
     const request = await readBody(event)
     request.user.accessToken = accessToken ;
    
     let placeOrdersRes = await Deskree.placeOrders(request)
     const isPlacingOrdersRejected  = placeOrdersRes.every((response)=>response.status === "rejected")  

    //if all orders got rejected try re-login and placing them again
    if(isPlacingOrdersRejected){
      const newAccessTokenRes = await obtainNewAccessToken()
     if(newAccessTokenRes) placeOrdersRes = await Deskree.placeOrders(request)
    }
    return placeOrdersRes
  })

