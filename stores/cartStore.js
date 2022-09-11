import { defineStore,acceptHMRUpdate } from "pinia"

export const useCartStore = defineStore("cartStore",{
state(){
    return {
        cartItems:[]
    }
},getters:{
    count(){
      return this.cartItems.reduce((p,c) => p+= c.fields.count,0);
    },
    subtotal(){
        return (this.cartItems.reduce((p,c)=>p+ c.fields.price * c.fields.count,0)/100).toFixed(2)
    },
    taxes(){
        return (this.subtotal * 0.1).toFixed(2)
    },
    totalCost(){
        return Number(this.subtotal) + Number(this.taxes)
    }
},
actions:{
    handleAddToCart(product){
       
        if( !this.cartItems.find((i)=> i.sys.id == product.sys.id)){
            product.fields.count = 1
this.cartItems.push(product)}
    },
    changeCount(id, count){
       
        
    let itemToChange =  this.cartItems.find((i)=> i.sys.id == id);
    itemToChange.fields.count = count
  
    } 

}

}
)
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useCartStore, import.meta.hot));
  }