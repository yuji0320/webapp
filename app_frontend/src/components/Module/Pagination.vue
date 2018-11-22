<template>
  <div class="text-xs-center">
      <v-pagination
        v-model="page"
        :length="length"
        :total-visible="5"
      ></v-pagination>
  </div>
</template>

<script>
export default {
  name: "pagination",
  data() {
    return {
      page: 1
    };
  },
  props: {
    length: { required: true },
    count: { required: true }
  },
  watch: {
    page(val) {
      this.$emit("paginate", val);
    }
  }
};
</script>
