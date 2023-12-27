
export default defineNuxtRouteMiddleware(  (to, from) => {
const deskree = useDeskree();
const user = deskree.user.get();
console.log(user)
    if (!user) {
      console.log("N")
       // navigateTo("/")
      } else {navigateTo("/cart");console.log("F")}

})