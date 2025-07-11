

/* We can get the locales from Contentful using the Contentful Management API.       

        const locales = await $contentfulManager.locale.getMany({ query: { contentTypeId: "product" } }) 
        const availableLocalesCodes = locales.items.map(locale => locale.code)
        const defaultLocales = locales.items.find(locale => locale.default).code
        const requiredLocales = locales.items.filter(locale => !locale.optional).map(locale => locale.code)
*/
export default function useContentful() {

   const { $contentfulManager } = useNuxtApp();
   const requiredFields = ["name", "summary", "description", "price"]

   const management = {
      locale : {
      defaultLocale: "en-US",
      requiredLocales: ["en-US"],
      availableLocalesCodes: ["en-US", "ar-SA"],
      localeNames:{
         "en-US": "English (United States)",
         "ar-SA": "Arabic (Saudi Arabia)"
      }
   },
      contentType: {
         object: {},
         set: async function (contentTypeId) {
            const contentType = await $contentfulManager.contentType.get({ contentTypeId: contentTypeId });
            this.object = contentType;
            return contentType;
         }

      },
      asset: {},
      entry: {
      },


   }

   return {
      management
   }
}