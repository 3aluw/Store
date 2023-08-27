import { defineStore, acceptHMRUpdate } from "pinia";


export const useAdminStore = defineStore("AdminStore", () => {
  const deskree = useDeskree();


const monthlyMetrics = ref({
  revenue : 0,
  newUsers: 0,
  salesUnits : 0,
  //orders
  orders : 0,
  ordersWaiting : 0,
  ordersDelivering : 0,
  ordersDelivered : 0
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
  const orders = await deskree.handleQuery("/orders",queryObj, '&limit=100');
 const newUsers = await deskree.handleQuery("/users",queryObj, '&limit=100')
 //add infos to the monthlyMetrics object
 monthlyMetrics.value.newUsers = newUsers.meta.total
 monthlyMetrics.value.orders = orders.meta.total
 monthlyMetrics.value.revenue = orders.data.reduce(( acc,cur)=> acc + cur.attributes.price , 0)
 monthlyMetrics.value.salesUnits = orders.data.reduce(( acc,cur)=> acc + cur.attributes.count , 0)

  //if the total data is larger than the data fetched - I will depend on deskree to calculate using delivery query-
  if(orders.meta.total > orders.meta.limit){ fetchOrdersMonthlyMetrics(queryObj)}
  //if it is smaller (means we got all the data locally)
  else {
     monthlyMetrics.value.ordersWaiting = orders.data.reduce((acc, cur) => acc + (cur.attributes.delivery_status === "waiting" ? 1 : 0 ), 0)
     monthlyMetrics.value.ordersDelivering = orders.data.reduce((acc, cur) => acc + (cur.attributes.delivery_status === "delivering" ? 1 : 0 ), 0)
     monthlyMetrics.value.ordersDelivered = orders.data.reduce((acc, cur) => acc + (cur.attributes.delivery_status === "delivered" ? 1 : 0 ), 0)
}

   }

//called only by the main function
const fetchOrdersMonthlyMetrics = (orders,queryObj)=>{
  const delivery_statusArr = ["waiting", "delivering", "delivered"]
  

}



  return {generateMonthlyMetrics, monthlyMetrics
   
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAdminStore, import.meta.hot));
}
