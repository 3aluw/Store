import { useLocalStorage } from "@vueuse/core";
import { useRouter } from "vue-router";
import {ref, watch} from "vue"
//roles
//admin, moderator
const roles = ["n1p7bliRJvTk3bwilZLh","ysQAF8GKCCAGR9hWVgVY"]
// user data persisted to local storage
const tokenInLocalStorage = useLocalStorage("deskree_token", null);
const refreshTokenInLocalStorage = useLocalStorage("deskree_refresh_token", null);
const userIdInLocalStorage = useLocalStorage("deskree_user_uid", null);
const loggedInUser = ref(null);
const loggedInUserInit = ref(false);

//a function that re-evaluate some data ie:cart on every auth change  (loggedInUser variable change)
const onAuthStateChangeCallbacks = ref([]);
watch(loggedInUser, () => {
  onAuthStateChangeCallbacks.value.forEach((callback) => {
    callback(loggedInUser.value);
  });
});

export function useDeskree() {
  const router = useRouter();

  // api configuration
  const baseURL = useRuntimeConfig().public.deskreeBaseUrl;

  // login the user saved in local storage when page loads
async function loginUserUsingLocalS(){
    if (
      tokenInLocalStorage.value &&
      userIdInLocalStorage.value &&
      !loggedInUser.value &&
      !loggedInUserInit.value
    ) {
    await  initUser(userIdInLocalStorage.value);
      loggedInUserInit.value = true;
    
    }
  };
  
  /**
   * Auth functions exposed from composable
   */
  const auth = {
    onAuthStateChange(callback) {
      onAuthStateChangeCallbacks.value.push(callback);
    },
    async signUp({ email, password }) {
      // hit signup endpoint on deskree
      const res = await $fetch("/auth/accounts/signup", {
        method: "POST",
        baseURL,
        body: { email, password },
      });
      const user = res.data;

      // store the token locally
      userIdInLocalStorage.value = user.uid;
      initToken(user.idToken, user.refreshToken);

      // create the users one and only cart
      const cart = await dbRestRequest("/carts", "POST", {
        products: JSON.stringify([]),
      });

      // connect that cart to the user
      dbRestRequest(`/users/${user.uid}`, "PATCH", {
        cartId: cart.data.uid,
      });

      user.cart = cart.data;
      user.cartId = cart.data.uid;
      initUser(user);
    },

    async login({ email, password }) {
      // call login endpoint
      const res = await $fetch("/auth/accounts/sign-in/email", {
        baseURL,
        method: "POST",
        body: { email, password },
      });

      // save user id and tokens to local storage
      userIdInLocalStorage.value = res.data.uid;
      initToken(res.data.idToken, res.data.refreshToken);

      // initialize the user with cart data
      await initUser(res.data.uid);
    },

    logout() {
      userIdInLocalStorage.value = null;
      tokenInLocalStorage.value = null;
      loggedInUser.value = null;
    },
  };

  /**
   * User function exposed from the composable
   */
  const user = {
    login() {
      return auth.login();
    },
    logout() {
      return auth.logout();
    },
     get () { 
      return  loggedInUser.value;
    },

   async updateUser({name, phone_number, wilaya,address}){
      dbRestRequest(`/users/${userIdInLocalStorage.value }`,"PATCH",{
        "address":address,"wilaya":wilaya,"name":name,"phone_number":phone_number  })
    loggedInUser.value = { ...loggedInUser.value,  "address":address,"wilaya":wilaya,"name":name,"phone_number":phone_number  }  
    },

    getByUid(uid){
      return dbRestRequest(`/users/${uid}`)
    },
    deleteUser(uid){
      return dbRestRequest(`/users/${uid}`,"DELETE")
    },
/*
 getUsersByDateRange(queryObj){
  return dbRestRequest("/users?where=" + JSON.stringify(queryObj))

   },
*/

    //cart
    async updateCart(products) {
      if (!loggedInUser.value || !loggedInUser.value.cartId) return;

      return dbRestRequest(`/carts/${loggedInUser.value.cartId}`, "PATCH", {
        products: JSON.stringify(products),
      });
    },
    async getCart() {
      if (!loggedInUser.value || !tokenInLocalStorage.value) return;
      const res = await dbRestRequest(`carts/${loggedInUser.value.cartId}`);
      res.data.products = JSON.parse(res.data.products);
      return res.data;
    },
    
  };

  /**
   * Reviews functions exposed from the composable
   */
  const reviews = {
    get(productId) {
      // make request to get reviews for a product here
       const querryParams =[{
attribute :"product_id",
operator : "=",
value: productId,
       }]
return dbRestRequest("/reviews?where=" + JSON.stringify(querryParams))
    },
    submit({ text, rating, title, product_id }) {
      
      
      dbRestRequest("/reviews","POST", {
        "text":text,"title":title,"rating":rating,"product_id":product_id
      })
    },
  };
const orders ={

 getOreders(){
const queryObj = [{"attribute":"author","operator":"=","value":userIdInLocalStorage.value}]

return dbRestRequest("/orders?where=" + JSON.stringify(queryObj))
},
placeOrder({count, sys, fields}){
 return dbRestRequest("/orders","POST", {
 "count" : count,
 "product_id": sys.id,
  "buyer_name": loggedInUser.value.name,
  "delivery_status" : "waiting",
  "phone_number" : loggedInUser.value.phone_number,
  "wilaya": loggedInUser.value.wilaya,
  "address": loggedInUser.value.address,
  "price" : fields.price*count ,
  })
},
 editOrder(uid,reqObj){
  const reqBody = JSON.stringify(reqObj)
return dbRestRequest(`/orders/${uid}`,"PATCH", reqBody)
},
deleteOrder(uid){
  return dbRestRequest(`/orders/${uid}`,"DELETE")
},
}

//query function 
const handleQuery = ( endpoint,queryObj ,params ='&limit=10')=>{
  return dbRestRequest( endpoint + "?where=" + JSON.stringify(queryObj) + params)
}

/**
   * guest user function exposed from the composable
   */


  // private composable functions
  function initToken(token, refreshToken) {
   if(token) tokenInLocalStorage.value = token;
   if(refreshToken) refreshTokenInLocalStorage.value = refreshToken;
  }

  async function initUser(userIdOrUser) {
    if (typeof userIdOrUser === "string") {
      try {
        const res = await dbRestRequest(`/users/${userIdOrUser}`);
        res.data.cart = await user.getCart();
        loggedInUser.value = await  res.data;
       
      } catch (err) {
        if (!err.body) return;

        const tokenHasExpired = err.body.errors.find((e) => e.code === "403" && e.detail.startsWith("Auth token has expired"));
        if (tokenHasExpired) {
          console.log('tokenHasExpired: ', tokenHasExpired);
          
          const getNewAccess = await useRefreshToken()
          getNewAccess ?   loginUserUsingLocalS() :   router.push("/logout"); useAlertsStore.notify("please login again")
         ;
        }
      } 
    } else {
      loggedInUser.value = userIdOrUser;
    }
    
  }
   //a function that return true if the access token had been renewed using the refresh token, false if it is not renewed
 async function useRefreshToken(){
  console.log("trying refresh token");
  try{
const res = await $fetch("/auth/accounts/token/refresh", {
  baseURL,
  method: "POST",
  body: { "refresh_token": refreshTokenInLocalStorage.value },
});
const newAccessToken = res.data.access_token
console.log('newAccessToken: ', newAccessToken);

initToken(newAccessToken)
return true
}
catch(err){
  console.log(err);
  return false
}
  }
  


  function dbRestRequest(endpoint, method = "GET", body) {
    endpoint = endpoint.replace(/^\//, "");
    return authorizedRestRequest(`/rest/collections/${endpoint}`, method, body);
  }

  function authorizedRestRequest(endpoint, method = "GET", body) {
    endpoint = endpoint.replace(/^\//, "");
    const options = {
      baseURL,
      method,
      headers: {
        Authorization: `Bearer ${tokenInLocalStorage.value}`,
      },
    };
    if (body && method !== "GET") options.body = body;
    return $fetch(endpoint, options);
  }

  return {roles,
    loginUserUsingLocalS,
    auth,
    user,
    reviews,
    tokenInLocalStorage,
    loggedInUser,
    initUser, 
    orders,handleQuery
  };
}


export const useDeskreeForGuest =()=>{
  const baseURL = useRuntimeConfig().public.deskreeBaseUrl;
  const guestUserAuth = {
    async authUsingMail ({ email, password }){
    // call login endpoint
    try{
    const res = await $fetch("/auth/accounts/sign-in/email", {
      baseURL,
      method: "POST",
      body: { email, password },
    });
    return { 
    "accessToken": res.data.idToken,
    "refreshToken": res.data.refreshToken}}
    catch(err){
      return err
    }
   },
  async authUsingRefreshToken (RefreshToken){
    try{
      const res = await $fetch("/auth/accounts/token/refresh", {
        baseURL,
        method: "POST",
        body: { "refresh_token": RefreshToken },
      });
      const newAccessToken = res.data.access_token
      return newAccessToken
      }
      catch(err){
        return false
      }
   }, 
   }
   const placeOrders = async ({products,user})=>{


const orderPromises = products.map((product)=>{
 return  authorizedRestRequest("/rest/collections/orders","POST",user.accessToken ,{
    "count" : product.count,
    "product_id": product.productId,
     "buyer_name": user.name,
     "delivery_status" : "waiting",
     "phone_number" : user.phone_number,
     "wilaya": user.wilaya,
     "address": user.address,
     "price" : product.price*product.count ,
     });
})
    const results = await Promise.allSettled(orderPromises);
    return results;   
   }
   function authorizedRestRequest(endpoint, method = "GET", accessToken,body) {
    endpoint = endpoint.replace(/^\//, "");
    const options = {
      baseURL,
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    if (body && method !== "GET") options.body = body;
    return $fetch(endpoint, options);
  }
  return{
    guestUserAuth, placeOrders
  }
} 