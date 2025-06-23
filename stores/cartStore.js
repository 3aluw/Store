import { defineStore, acceptHMRUpdate } from "pinia";
import { watchDebounced } from "@vueuse/core";

export const useCartStore = defineStore("CartStore", () => {
  const deskree = useDeskree();
  const productStore = useProductStore();
  // state
  const productsIds = ref([]) // [{productId, count}]
  const products = ref([]);
/* 
  watchEffect(async () => {
    const results = await Promise.all(productsIds.value.map(async (idObject) => {
      let product = productStore.products.find(p => p.sys.id === idObject.productId);
      if (!product) {
        product = await productStore.fetchProduct(idObject.productId);
      }
      return { ...product, count: idObject.count };
    }));

    products.value = results;
  }); */

  const taxRate = 0.1;
  const isFirstLoad = ref(false);
  const loading = ref(false);
  const wilayas = [
    "Adrar",
    "Chlef",
    "Laghouat",
    "Oum El Bouaghi",
    "Batna",
    "Béjaïa",
    "Biskra",
    "Béchar",
    "Blida",
    "Bouïra",
    "Tamanrasset",
    "Tébessa",
    "Tlemcen",
    "Tiaret",
    "Tizi Ouzou",
    "Algiers",
    "Djelfa",
    "Jijel",
    "Sétif",
    "Saïda",
    "Skikda",
    "Sidi Bel Abbès",
    "Annaba",
    "Guelma",
    "Constantine",
    "Médéa",
    "Mostaganem",
    "M'Sila",
    "Mascara",
    "Ouargla",
    "Oran",
    "El Bayadh",
    "Illizi",
    "Bordj Bou Arréridj",
    "Boumerdès",
    "El Tarf",
    "Tindouf",
    "Tissemsilt",
    "El Oued",
    "Khenchela",
    "Souk Ahras",
    "Tipaza",
    "Mila",
    "Aïn Defla",
    "Naâma",
    "Aïn Témouchent",
    "Ghardaïa",
    "Relizane",
    "El M'Ghair",
    "El Menia",
    "Ouled Djellal",
    "Bordj Baji Mokhtar",
    "Béni Abbès",
    "Timimoun",
    "Touggourt",
    "Djanet",
    "In Salah",
    "In Guezzam"
  ];
  // getters
  const count = computed(() => productsIds.value.reduce((prev, current) => { return prev += current.count }, 0));
  const isEmpty = computed(() => count.value === 0);
  const subtotal = computed((state) => {
    return products.value.reduce((p, product) => {
      return product?.fields?.price
        ? product.fields.price * product.count + p
        : p;
    }, 0);
  });
  const taxTotal = computed(() => subtotal.value * taxRate);
  const total = computed(() => taxTotal.value + subtotal.value);
  // actions
  function removeProducts(productIds) {
    productIds = Array.isArray(productIds) ? productIds : [productIds];
    products.value = products.value.filter(
      (p) => !productIds.includes(p.sys.id)
    );
  }

  function addProduct(productId, count) {
    const existingProductId = productsIds.value.find((id) => id === productId);
    if (existingProductId) {
      existingProductId.count += count;
    } else {
      productsIds.value.push({ productId, count });
    }
    addProductObject(productId, count);
    return count;
  }
  const addProductObject = async (productId, count) => {
    let product = productStore.products.find(p => p.sys.id === productId);
    if (!product) {
      product = await productStore.fetchProduct(productId);
    }
    products.value.push({ ...product, count });
  }

  // triggers
  // init data
  deskree.auth.onAuthStateChange(async (user) => {
    isFirstLoad.value = true;
    loading.value = true;
    const res = await deskree.user.getCart();
    res.productsIds.forEach((productIdObj) => addProduct(productIdObj.productId, productIdObj.count));
    loading.value = false;
    setTimeout(() => (isFirstLoad.value = false), 1000);
  });
  // update data whenever products change
  watchDebounced(
    products,
    async () => {
      if (isFirstLoad.value) return;
      if (!deskree.user.get()) return;
      await deskree.user.updateCart(products.value, productsIds.value);
    },
    {
      debounce: 500,
      deep: true,
    }
  );

  return {
    products,
    wilayas,
    taxRate,
    count,
    isEmpty,
    subtotal,
    taxTotal,
    total,
    loading,
    removeProducts,
    addProduct,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCartStore, import.meta.hot));
}
