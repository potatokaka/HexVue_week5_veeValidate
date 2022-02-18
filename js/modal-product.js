export default {
  template: "#userProductModal",
  props: ["id"],
  data() {
    return {
      apiUrl: "https://vue3-course-api.hexschool.io/v2",
      apiPath: "filter117",
      bsModal: "",
      product: {},
      qty: 1,
    };
  },
  watch: {
    id() {
      this.getProduct();
    },
  },
  methods: {
    openModal() {
      this.bsModal.show();
    },
    closeModal() {
      this.bsModal.hide();
    },
    getProduct() {
      axios
        .get(`${this.apiUrl}/api/${this.apiPath}/product/${this.id}`)
        .then((res) => {
          this.product = res.data.product;
        })
        .catch((err) => {
          console.log(err.response.data);
        });
    },
    addToCart() {
      this.$emit("add-to-cart", this.id, this.qty);
      this.closeModal();
    },
  },
  mounted() {
    this.bsModal = new bootstrap.Modal(this.$refs.modal);
  },
};
