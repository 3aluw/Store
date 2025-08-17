import { defineStore, acceptHMRUpdate } from "pinia";


export const useAdminStore = defineStore("AdminStore", () => {
  const deskree = useDeskree();

  const monthlyMetrics = ref({
    revenue: 0,
    newUsers: 0,
    salesUnits: 0,
    //orders
    orders: 0,
    ordersWaiting: 0,
    ordersDelivering: 0,
    ordersDelivered: 0
  })
  //object of newest users and orders
  const ordersObject = ref()
  const usersObject = ref()

  //move to useDeskree
  const generateRangeQueryObject = (start, end) => {
    return [{ "attribute": "createdAt", "operator": ">", "value": start }, { "attribute": "createdAt", "operator": "<", "value": end }]
  }



  const generateMonthlyMetrics = async () => {
    //generate the query object using timer composable to generate the start and the end of the month
    const queryObj = generateRangeQueryObject(useTimer().generateMonthBoundaries()[0], useTimer().generateMonthBoundaries()[1]);
    //fetch the data
    const fetchOrders = deskree.handleQuery("/orders", queryObj, '&limit=100');
    const fetchUsers = deskree.handleQuery("/users", queryObj, '&limit=100');

    let orders
    let newUsers
    try {
      orders = await fetchOrders
      newUsers = await fetchUsers
    }
    catch (err) {
      if (!orders) { useAlertsStore().error("a problem while fetching orders") }
      else if (!users) { useAlertsStore().error("a problem while fetching users") }
    }
    finally {
      if (orders) {

        ordersObject.value = orders;
        monthlyMetrics.value.orders = orders.meta.total
        monthlyMetrics.value.revenue = orders.data.reduce((acc, cur) => acc + cur.attributes.price, 0)
        monthlyMetrics.value.salesUnits = orders.data.reduce((acc, cur) => acc + cur.attributes.count, 0)

      }
      if (newUsers) {

        usersObject.value = newUsers
        //add infos to the monthlyMetrics object
        monthlyMetrics.value.newUsers = newUsers.meta.total
      }

      //if the total data is larger than the data fetched - I will depend on deskree to calculate using delivery query-
      if (orders.meta.total > orders.meta.limit) { fetchOrdersMonthlyMetrics(queryObj) }
      //if it is smaller (means we got all the data locally)
      else {
        monthlyMetrics.value.ordersWaiting = orders.data.reduce((acc, cur) => acc + (cur.attributes.delivery_status === "waiting" ? 1 : 0), 0)
        monthlyMetrics.value.ordersDelivering = orders.data.reduce((acc, cur) => acc + (cur.attributes.delivery_status === "delivering" ? 1 : 0), 0)
        monthlyMetrics.value.ordersDelivered = orders.data.reduce((acc, cur) => acc + (cur.attributes.delivery_status === "delivered" ? 1 : 0), 0)
      }
    }
  }

  //called only by the main function
  const fetchOrdersMonthlyMetrics = (orders, queryObj) => {
    const delivery_statusArr = ["waiting", "delivering", "delivered"]
  }



  //a function that returns an object to be used in queries :  operator use :=
  const generateQueryObject = (attribute, value) => {
    return [{ "attribute": attribute, "operator": "=", "value": value }]
  }

  return {
    generateMonthlyMetrics, generateRangeQueryObject, monthlyMetrics, usersObject, ordersObject, generateQueryObject

  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAdminStore, import.meta.hot));
}
