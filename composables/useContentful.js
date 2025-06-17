/* We can get the content type and locales from Contentful using the Contentful Management API.       
  const contentType = await $contentfulManager.contentType.get({ contentTypeId: "product" })
        const locales = await $contentfulManager.locale.getMany({ query: { contentTypeId: "product" } }) 
        const availableLocales = locales.items.map(locale => locale.code)
        const defaultLocales = locales.items.find(locale => locale.default).code
        const requiredLocales = locales.items.filter(locale => !locale.optional).map(locale => locale.code)
*/
export default function useContentful() {

const requiredFields = ["name", "summary", "description", "price"]
const defaultLocales = "en-US";
const requiredLocales = ["en-US"]
const availableLocales = ["en-US", "ar-SA"]

const Management = {

}

return{
   requiredFields,requiredLocales
}
}