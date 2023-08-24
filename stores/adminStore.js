import { defineStore, acceptHMRUpdate } from "pinia";


export const useAdminStore = defineStore("AdminStore", () => {
  const deskree = useDeskree();


const monthlyMetrics = ref({
  revenue : '',
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
   
   const generateMonthlyMetrics = async ()=>{
    //generate the query object
    const queryObj = generateMonthlyQueryObject();
//fetch the data
  const orders = await deskree.orders.getOrdersByDateRange(queryObj);
 const newUsers = await deskree.user.getUsersByDateRange(queryObj)
 //add infos to the monthlyMetrics object
 monthlyMetrics.value.newUsers = newUsers.meta.total
 monthlyMetrics.value.orders = orders.meta.total
 monthlyMetrics.value.revenue = orders.data.reduce(( acc,cur)=> acc + cur.attributes.price , 0)
   }



  return {generateMonthlyMetrics, monthlyMetrics
   
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAdminStore, import.meta.hot));
}
