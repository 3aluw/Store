import { defineStore, acceptHMRUpdate } from "pinia";
export const useProductStore = defineStore("ProductStore", {
  state: () => {
    return {
      /*
       * The listing of all the products
       */
      products: [],
      /*
       * Different ways of fetching the listing of products (filters, order, search)
       */
      filters: {
        "fields.category":useRoute().query["fields.category"] || "",
        order: useRoute().query.order||"" ,
        query: useRoute().query.query || "",
      },

      singleProduct: undefined,

      //Product categories
     categories : []
    };
  },
  getters: {
    activeFilters() {
      const clone = JSON.parse(JSON.stringify(this.filters));
      // remove blank object properties
      return Object.fromEntries(
        Object.entries(clone).filter(([_, v]) => v != null)
      );
    },
  },
  actions: {
    async fetchProducts(locale) {
   const { $contentful} = useNuxtApp();
   const activeFilters = this.activeFilters
   const entries = await $contentful.getEntries({
    content_type : "product",
    ...this.filters,
    locale: locale,
   });
   this.products =  entries.items ; 
   return this.products
    },

    async fetchProduct(id, locale) {
      const { $contentful } = useNuxtApp();
      this.singleProduct = await $contentful.getEntry(id,{
        locale,
      });
      return this.singleProduct;
    },
    async fetchCategories(){
      const { $contentful} = useNuxtApp();
      const contentType = await $contentful.getContentType("product")
     this.categories = contentType.fields.find(field => field.id === "category").items.validations[0].in
    }
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProductStore, import.meta.hot));
}
