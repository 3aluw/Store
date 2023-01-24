import { defineStore, acceptHMRUpdate } from "pinia";
export const useOrdersStore = defineStore("ordersStore", {
  state: () => {
    return {
  
      orders: [],

    
    };
  },

  actions: {
    async fetchOrder(id) {
      const { $contentful } = useNuxtApp();
      const order = await $contentful.getEntry(id);
      console.log(order)
      this.orders.push(order)
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProductStore, import.meta.hot));
}
