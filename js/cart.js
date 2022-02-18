// modal 元件
import compProductModal from "./modal-product.js";

// API 資料
const apiUrl = "https://vue3-course-api.hexschool.io/v2";
const apiPath = "filter117";

// vee-validate
const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

defineRule("required", required);
defineRule("email", email);
defineRule("min", min);
defineRule("max", max);

loadLocaleFromURL(
  "https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json"
);

configure({
  // 用來做一些設定
  generateMessage: localize("zh_TW"), //啟用 locale
  validateOnInput: false, // True 為輸入字元時，立即進行驗證　(原本是停止輸入後才做驗証)
});
// End vee-validate

const app = Vue.createApp({
  data() {
    return {
      products: [],
      productId: "", // 要傳入 modal 用的
      isLoadingItem: "",
      cart: {
        carts: [],
      },
      form: {
        user: {
          name: "",
          email: "",
          tel: "",
          address: "",
        },
        message: "",
      },
    };
  },
  components: {
    compProductModal, // modal 元件
    // vee-validate
    VForm: Form,
    VField: Field,
    ErrorMessage: ErrorMessage,
  },
  methods: {
    getProducts() {
      axios
        .get(`${apiUrl}/api/${apiPath}/products`)
        .then((res) => {
          // console.log(res.data);
          this.products = res.data.products;
        })
        .catch((err) => {
          console.log(err.response.data);
        });
    },
    getCart() {
      axios
        .get(`${apiUrl}/api/${apiPath}/cart`)
        .then((res) => {
          this.cart = res.data.data;
        })
        .catch((err) => {
          console.log(err.response.data);
        });
    },
    addToCart(id, qty = 1) {
      this.isLoadingItem = id;

      const obj = {
        data: {
          product_id: id,
          qty,
        },
      };
      axios
        .post(`${apiUrl}/api/${apiPath}/cart`, obj)
        .then((res) => {
          alert(res.data.message);
          this.getCart();
          this.isLoadingItem = "";
        })
        .catch((err) => {
          console.log(err.response.data);
        });
    },
    updateCartItem(item) {
      this.isLoadingItem = item.id;
      const obj = {
        data: {
          product_id: item.product_id,
          qty: item.qty,
        },
      };

      axios
        .put(`${apiUrl}/api/${apiPath}/cart/${item.id}`, obj)
        .then((res) => {
          alert(res.data.message);
          this.isLoadingItem = "";
          this.getCart();
        })
        .catch((err) => {
          console.log(err.response.data);
        });
    },
    deleteCarts() {
      this.isLoadingItem = true;
      axios
        .delete(`${apiUrl}/api/${apiPath}/carts`)
        .then((res) => {
          alert(res.data.message);
          this.getCart();
          this.isLoadingItem = "";
        })
        .catch((err) => {
          console.log(err.response.data);
        });
    },
    deleteCartItem(id) {
      this.isLoadingItem = id;
      axios
        .delete(`${apiUrl}/api/${apiPath}/cart/${id}`)
        .then((res) => {
          alert(res.data.message);
          this.getCart();
          this.isLoadingItem = "";
        })
        .catch((err) => {
          console.log(err.response.data);
        });
    },
    // 產品 modal
    openProductModal(id) {
      this.productId = id;
      this.$refs.productModal.openModal();
    },
    // vee-validate 規則
    isPhone(value) {
      const phoneNumber = /^(09)[0-9]{8}$/;
      return phoneNumber.test(value) ? true : "請輸入正確的電話號碼";
    },
    // 送出訂單
    createOrder() {
      const obj = {
        data: this.form,
      };
      axios
        .post(`${apiUrl}/api/${apiPath}/order`, obj)
        .then((res) => {
          alert(res.data.message);
          this.getCart();
          this.$refs.form.resetForm();
        })
        .catch((err) => {
          console.log(err.response.data);
        });
    },
  },
  mounted() {
    this.getProducts();
    this.getCart();
  },
});

app.mount("#app");
