

/* We can get the locales from Contentful using the Contentful Management API.       

        const locales = await $contentfulManager.locale.getMany({ query: { contentTypeId: "product" } }) 
        const availableLocales = locales.items.map(locale => locale.code)
        const defaultLocales = locales.items.find(locale => locale.default).code
        const requiredLocales = locales.items.filter(locale => !locale.optional).map(locale => locale.code)
*/
export default function useContentful() {

const { $contentfulManager } = useNuxtApp();
const requiredFields = ["name", "summary", "description", "price"]
const defaultLocales = "en-US";
const requiredLocales = ["en-US"]
const availableLocales = ["en-US", "ar-SA"]

const management = {
   contentType:{
      object:{},
      set: async function(contentTypeId){
       const contentType = await $contentfulManager.contentType.get({contentTypeId: contentTypeId});
       this.object = contentType;
       return contentType;
      }
       
     
   },
   asset:{},
   entry:{
   },
   

}

return{
   requiredFields,requiredLocales, management
}
}