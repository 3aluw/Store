<template>
    <div class="invoice-cont hidden" id="invoice-cont">
        <div class="logo-container flex">
            <svg version="1.1" width="20px" height="20px" xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xml:space="preserve" fill="#ff0000"
                stroke="#ff0000">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                    <g>
                        <path
                            d="M14.1,14.7L14.1,14.7c0,4.8-2.1,9.3-5.8,12.2l-1.7,1.3c-0.4,0.3-0.5,0.8-0.2,1.3C6.6,29.8,6.9,30,7.3,30 c0.1,0,0.2,0,0.3-0.1l4.1-1.5c5.9-2.2,10.1-7.5,11.1-13.8C19.9,13.8,17,13.8,14.1,14.7z">
                        </path>
                        <path
                            d="M20,7.7c0.1-1.5,1-2.9,2.3-3.9c0.4-0.3,0.5-1,0.2-1.4c-0.3-0.4-1-0.5-1.4-0.2c-1.8,1.3-3,3.2-3.1,5.3c-2.2,0.3-4,2.2-4,4.5 v0.6c2.9-0.8,6-0.8,8.9,0c0-0.2,0-0.4,0-0.6C23,10,21.8,8.3,20,7.7z">
                        </path>
                    </g>
                </g>
            </svg>
            <p class="bold">falafel</p>
        </div>

        <table class="invoice-info-container">
            <tr>
                <td rowspan="2" class="client-name text-left">
                    {{ props.user?.name }}
                </td>
                <td class="text-right">
                    Falafel
                </td>
            </tr>
            <tr>
                <td class="text-right">
                    Algiers, Algeria
                </td>
            </tr>
            <tr>
                <td class="text-left">
                    Invoice Date: <strong>{{ new Intl.DateTimeFormat('en-GB', {
                        day: '2-digit', month: '2-digit', year:
                            'numeric'
                    }).format(new Date()) }}</strong>
                </td>
                <td class="text-right">0557923990</td>
            </tr>
            <tr>
                <td class="text-left">
                    city: <strong>{{ props.user?.wilaya }}</strong>
                </td>
                <td class="text-right">
                    falafel@gmail.com
                </td>
            </tr>
        </table>


        <table class="line-items-container">
            <thead>
                <tr>
                    <th class="heading-quantity">Qty</th>
                    <th class="heading-description">product</th>
                    <th class="heading-price">Price</th>
                    <th class="heading-subtotal">Subtotal</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="order in props.orders">
                    <td>{{ order.count }}</td>
                    <td>{{ order.product_name }}</td>
                    <td class="right">{{ order.price }}</td>
                    <td class="bold text-right">{{ order.price * order.count }}</td>
                </tr>

            </tbody>
        </table>


        <table class="line-items-container has-bottom-border">
            <thead>
                <tr>
                    <th>Payment Info</th>
                    <th>Due By</th>
                    <th>Total Due</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="payment-info text-left">
                        <div>
                            Account No: <strong>123567744</strong>
                        </div>
                        <div>
                            Routing No: <strong>120000547</strong>
                        </div>
                    </td>
                    <td class="large text-left">On Delivery</td>
                    <td class="large total text-right">${{ total }}</td>
                </tr>
            </tbody>
        </table>

        <div class="invoice-footer">
            <div class="invoice-footer-info">
                <span>falafel@gmail.com</span> |
                <span>0557923990</span> |
                <span>Falafel.com</span>
            </div>
            <div class="invoice-footer-thanks">
                <svg width="20px" height="20px" fill="#ff1414" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
                    stroke="#ff1414">
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                        <path
                            d="M14 20.408c-.492.308-.903.546-1.192.709-.153.086-.308.17-.463.252h-.002a.75.75 0 01-.686 0 16.709 16.709 0 01-.465-.252 31.147 31.147 0 01-4.803-3.34C3.8 15.572 1 12.331 1 8.513 1 5.052 3.829 2.5 6.736 2.5 9.03 2.5 10.881 3.726 12 5.605 13.12 3.726 14.97 2.5 17.264 2.5 20.17 2.5 23 5.052 23 8.514c0 3.818-2.801 7.06-5.389 9.262A31.146 31.146 0 0114 20.408z">
                        </path>
                    </g>
                </svg>
                <span>Thank you for your trust !</span>
            </div>

        </div>
        <div>.</div>
    </div>
</template>
<script setup>

const { $html2pdf } = useNuxtApp()

const props = defineProps(["user", "orders"])
const emit = defineEmits(['hideInvoiceComp'])
function emitHideInvoiceComp() { emit('hideInvoiceComp') }

const total = computed(() => props.orders.reduce((prev, curr) => { return curr.price * curr.count + prev }, 0))
onMounted(() => {


    downloadPDF();
})


function downloadPDF() {
    if (document) {
        const element = document.getElementById('invoice-cont')

        // clone the element: https://stackoverflow.com/questions/60557116/html2pdf-wont-print-hidden-div-after-unhiding-it/60558415#60558415
        const clonedElement = element.cloneNode(true)
        clonedElement.classList.remove('hidden')
        // need to append to the document, otherwise the downloading doesn't start
        document.body.appendChild(clonedElement)

        // https://www.npmjs.com/package/html2pdf.js/v/0.9.0#options
        $html2pdf(clonedElement, {
            margin: 20,
            filename: 'invoice.pdf',
            image: { type: 'png' },
            enableLinks: true
        })
        clonedElement.remove()
        emitHideInvoiceComp()
    }
}

</script>

<style scoped>
table {
    width: 100%;
    border-collapse: collapse;
}

table tr td {
    padding: 0;
}


.bold {
    font-weight: bold;
}

.right {
    text-align: right;
}

.large {
    font-size: 1.75em;
}

.total {
    font-weight: bold;
    color: #fb7578;
}

.logo-container {
    margin: 20px 0 70px 0;
}

.invoice-info-container {
    font-size: 0.875em;
}

.invoice-info-container td {
    padding: 4px 0;
}

.client-name {
    font-size: 1.5em;
    vertical-align: top;
}

.line-items-container {
    margin: 70px 0;
    font-size: 0.875em;
}

.line-items-container th {
    text-align: left;
    color: #999;
    border-bottom: 2px solid #ddd;
    padding: 10px 0 15px 0;
    font-size: 0.75em;
    text-transform: uppercase;
}

.line-items-container th:last-child {
    text-align: right;
}

.line-items-container td {
    padding: 15px 0;
}

.line-items-container tbody tr:first-child td {
    padding-top: 25px;
}

.line-items-container.has-bottom-border tbody tr:last-child td {
    padding-bottom: 25px;
    border-bottom: 2px solid #ddd;
}

.line-items-container.has-bottom-border {
    margin-bottom: 0;
}

.line-items-container th.heading-quantity {
    width: 50px;
}

.line-items-container th.heading-price {
    text-align: right;
    width: 100px;
}

.line-items-container th.heading-subtotal {
    width: 100px;
}

.payment-info {
    width: 38%;
    font-size: 0.75em;
    line-height: 1.5;
}

.invoice-footer {
    margin-top: 100px;
    padding-bottom: 1rem;
}

.invoice-footer-thanks {
    font-size: 1.125em;
}

.invoice-footer-thanks svg {
    display: inline-block;
    position: relative;
    bottom: 1px;
    width: 16px;
    margin-right: 4px;
}

.invoice-footer-info {
    float: right;
    margin-top: 5px;
    font-size: 0.75em;
    color: #ccc;
}

.invoice-footer-info span {
    padding: 0 5px;
    color: black;
}

.invoice-footer-info span:last-child {
    padding-right: 0;
}

.page-container {
    display: none;
}
</style>