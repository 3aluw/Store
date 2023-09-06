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

      singleProduct: null,

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
    async fetchProducts() {

   const { $contentful} = useNuxtApp();
   const activeFilters = this.activeFilters
   const entries = await $contentful.getEntries({
    content_type : "product",
    ...this.filters
   });
   this.products =  entries.items ; 
   return this.products
    },

    async fetchProduct(id) {
      const { $contentful } = useNuxtApp();
      this.singleProduct = await $contentful.getEntry(id);
      return this.singleProduct;
    },
    async fetchCategories(){
      const { $contentful} = useNuxtApp();
      const contentType = await $contentful.getContentType("product")
      //the 5th field is category on contentful...it needs to bee changed if its order had been changed in contentful
     this.categories = contentType.fields[5].items.validations[0].in 
    }
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProductStore, import.meta.hot));
}
