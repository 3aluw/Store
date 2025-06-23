import { useLocalStorage } from "@vueuse/core";
import { useRouter } from "vue-router";
import { ref, watch } from "vue"

//roles
//admin, moderator
const roles = ["n1p7bliRJvTk3bwilZLh", "ysQAF8GKCCAGR9hWVgVY"]

const defaultCallBackUri = "http://localhost:3000/register"
const defaultProviderId = "google.com"
// user data persisted to local storage
const tokenInLocalStorage = useLocalStorage("deskree_token", null);
const refreshTokenInLocalStorage = useLocalStorage("deskree_refresh_token", null);
const userIdInLocalStorage = useLocalStorage("deskree_user_uid", null);
const loggedInUser = ref(null);
const loggedInUserInit = ref(false);

//This creates a reactive array to hold all the functions (callbacks) that want to be notified when the loggedInUser changes.
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
  async function loginUserUsingLocalS() {
    if (
      tokenInLocalStorage.value &&
      userIdInLocalStorage.value &&
      !loggedInUser.value &&
      !loggedInUserInit.value
    ) {

      await initUser(userIdInLocalStorage.value);
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

      processUser(user, true)
    },

    async login({ email, password }) {
      // call login endpoint
      const res = await $fetch("/auth/accounts/sign-in/email", {
        baseURL,
        method: "POST",
        body: { email, password },
      });
      const user = res.data
      processUser(user, false)

    },

    logout() {
      userIdInLocalStorage.value = null;
      tokenInLocalStorage.value = null;
      loggedInUser.value = null;
    },
  };
  /**
 * Google Oauth functions exposed from composable
 */
  const Oauth = {
    createOauthUrl: async (providerId = defaultProviderId, callBackUri = defaultCallBackUri) => {
      const res = await $fetch("/auth/accounts/sign-in/auth-url", {
        baseURL,
        method: "POST",
        body: { "providerId": providerId, "callBackUri": callBackUri },
      });
      return res
    },
    signInOauth: async (requestParams) => {
      console.log('requestParams: ', requestParams);
      const { callBackUri, data, token } = requestParams
      const { sessionId, providerId } = data
      //Get user IdToken - Id from deskree
      const res = await $fetch("/auth/accounts/sign-in/idp", {
        baseURL,
        method: "POST",
        body: { sessionId, providerId, callBackUri, token },
      })
      //rename id property + check if he's a new user
      res.data.uid = res.data.localId
      const isUserNew = res.data.isNewUser
      processUser(res.data, isUserNew)
      return isUserNew
    },
  }

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
    get() {
      return loggedInUser.value;
    },

    async updateUser({ name, phone_number, wilaya, address }) {
      dbRestRequest(`/users/${userIdInLocalStorage.value}`, "PATCH", {
        "address": address, "wilaya": wilaya, "name": name, "phone_number": phone_number
      })
      loggedInUser.value = { ...loggedInUser.value, "address": address, "wilaya": wilaya, "name": name, "phone_number": phone_number }
    },

    getByUid(uid) {
      return dbRestRequest(`/users/${uid}`)
    },
    deleteUser(uid) {
      return dbRestRequest(`/users/${uid}`, "DELETE")
    },
    /*
     getUsersByDateRange(queryObj){
      return dbRestRequest("/users?where=" + JSON.stringify(queryObj))
    
       },
    */

    //cart
    async updateCart(products,productsIds) {
      if (!loggedInUser.value || !loggedInUser.value.cartId) return;
      return dbRestRequest(`/carts/${loggedInUser.value.cartId}`, "PATCH", {
        products: JSON.stringify(products),
        productsIds: JSON.stringify(productsIds),
      });
    },
    async getCart() {
      if (!loggedInUser.value || !tokenInLocalStorage.value) return;
      const res = await dbRestRequest(`carts/${loggedInUser.value.cartId}`);
      res.data.productsIds = JSON.parse(res.data?.productsIds); 
      return res.data;
    },

  };

  /**
   * Reviews functions exposed from the composable
   */
  const reviews = {
    get(productId) {
      // make request to get reviews for a product here
      const querryParams = [{
        attribute: "product_id",
        operator: "=",
        value: productId,
      }]
      return dbRestRequest("/reviews?where=" + JSON.stringify(querryParams))
    },
    submit({ text, rating, title, product_id }) {


      dbRestRequest("/reviews", "POST", {
        "text": text, "title": title, "rating": rating, "product_id": product_id
      })
    },
  };
  const orders = {

    getOreders() {
      const queryObj = [{ "attribute": "author", "operator": "=", "value": userIdInLocalStorage.value }]

      return dbRestRequest("/orders?where=" + JSON.stringify(queryObj))
    },
    async placeOrder(products) {
      const orderPromises = products.map((product) => {
        let { count, sys, fields } = product;
        return dbRestRequest("/orders", "POST", {
          "count": count,
          "product_id": sys.id,
          "buyer_name": loggedInUser.value.name,
          "delivery_status": "waiting",
          "phone_number": loggedInUser.value.phone_number,
          "wilaya": loggedInUser.value.wilaya,
          "address": loggedInUser.value.address,
          "price": fields.price * count,
        })
      })

      const results = await Promise.allSettled(orderPromises);
      return results
    },
    editOrder(uid, reqObj) {
      const reqBody = JSON.stringify(reqObj)
      return dbRestRequest(`/orders/${uid}`, "PATCH", reqBody)
    },
    deleteOrder(uid) {
      return dbRestRequest(`/orders/${uid}`, "DELETE")
    },
  }

  //query function 
  const handleQuery = (endpoint, queryObj, params = '&limit=10') => {
    return dbRestRequest(endpoint + "?where=" + JSON.stringify(queryObj) + params)
  }

  // private composable functions
  function initToken(token, refreshToken) {
    if (token) tokenInLocalStorage.value = token;
    if (refreshToken) refreshTokenInLocalStorage.value = refreshToken;
  }

  //save tokens locally and create a cart for the new user  
  async function processUser(user, isNew) {

    userIdInLocalStorage.value = user.uid
    initToken(user.idToken, user.refreshToken);

    if (isNew) {
      // create the user's one and only cart
      const cart = await dbRestRequest("/carts", "POST", {
        productsIds: JSON.stringify([]),
      });
      // connect that cart to the user
      dbRestRequest(`/users/${user.uid}`, "PATCH", {
        cartId: cart.data.uid,
      });

      user.cart = cart.data;
      user.cartId = cart.data.uid;
      console.log('cartId: ', user.cartId);
      await initUser(user);
    }
    else {
      // initialize the loggedIn user with cart data
      await initUser(user.uid);
    }

  }


  //set up the user object (name,city...) using his Id or using a user object
  async function initUser(userIdOrUser) {
    if (typeof userIdOrUser === "string") {
      try {
        const res = await dbRestRequest(`/users/${userIdOrUser}`);
        //Uncomment
        // loggedInUser.value = await res.data;
        // console.log('res: ', res);
        res.data.cart = await user.getCart();
        loggedInUser.value = await res.data;
      } catch (err) {
        if (!err.response._data) return;

        const tokenHasExpired = err.response._data.errors.find((e) => e.code === "403" && e.detail.startsWith("Auth token has expired"));
        if (tokenHasExpired) {
          const getNewAccess = await useRefreshToken()
          if (getNewAccess) loginUserUsingLocalS()
          else { router.push("/logout"); useAlertsStore().notify("please login again") }
          ;
        }
      }
    } else {
      loggedInUser.value = userIdOrUser;
    }

  }
  //a function that return true if the access token had been renewed using the refresh token, false if it is not renewed
  async function useRefreshToken() {
    try {
      const res = await $fetch("/auth/accounts/token/refresh", {
        baseURL,
        method: "POST",
        body: { "refresh_token": refreshTokenInLocalStorage.value },
      });
      const newAccessToken = res.data.access_token

      initToken(newAccessToken)
      return true
    }
    catch (err) {
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

  return {
    roles,
    loginUserUsingLocalS,
    auth, Oauth,
    user,
    reviews,
    tokenInLocalStorage,
    loggedInUser,
    initUser,
    orders, handleQuery
  };
}


export const useDeskreeForGuest = () => {
  const baseURL = useRuntimeConfig().public.deskreeBaseUrl;
  const guestUserAuth = {
    async authUsingMail({ email, password }) {
      // call login endpoint
      try {
        const res = await $fetch("/auth/accounts/sign-in/email", {
          baseURL,
          method: "POST",
          body: { email, password },
        });
        return {
          "accessToken": res.data.idToken,
          "refreshToken": res.data.refreshToken
        }
      }
      catch (err) {
        return err
      }
    },
    async authUsingRefreshToken(RefreshToken) {
      try {
        const res = await $fetch("/auth/accounts/token/refresh", {
          baseURL,
          method: "POST",
          body: { "refresh_token": RefreshToken },
        });
        const newAccessToken = res.data.access_token
        return newAccessToken
      }
      catch (err) {
        return false
      }
    },
  }
  const placeOrders = async ({ products, user }) => {

    const orderPromises = products.map((product) => {
      return authorizedRestRequest("/rest/collections/orders", "POST", user.accessToken, {
        "count": product.count,
        "product_id": product.productId,
        "buyer_name": user.name,
        "delivery_status": "waiting",
        "phone_number": user.phone_number,
        "wilaya": user.wilaya,
        "address": user.address,
        "price": product.price * product.count,
      });
    })
    const results = await Promise.allSettled(orderPromises);
    return results;
  }
  function authorizedRestRequest(endpoint, method = "GET", accessToken, body) {
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
  return {
    guestUserAuth, placeOrders
  }
} 