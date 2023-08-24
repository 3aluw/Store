import { defineStore, acceptHMRUpdate } from "pinia";


export const useAdminStore = defineStore("AdminStore", () => {
  const deskree = useDeskree();


const monthlyMetrics = ref({
  sales : '',
  newUsers: '',
  orders : '',
})

  const generateMonthBoundaries = ()=>{
    const  text = new Date().toISOString()
    const reg = /\d+T/
    const start = text.replace(reg,"01T00:00:00")
    const end = text.replace(reg,"30T23:59:00")

    return [ start, end]
   }
  
   const generateMonthlyQueryObject = ()=>{
    const [monthStart, monthEnd] = generateMonthBoundaries();
   return [{"attribute":"createdAt","operator":">","value":monthStart},{"attribute":"createdAt","operator":"<","value":monthEnd} ]
   }
   
   const generateMonthlyMetrics = ()=>{
    const queryObj = generateMonthlyQueryObject();
    
    deskree.orders.getOredersByDateRange(queryObj)
   }



  return {generateMonthlyMetrics
   
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAdminStore, import.meta.hot));
}
