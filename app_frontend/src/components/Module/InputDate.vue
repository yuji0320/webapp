<template>
  <v-text-field 
    :label="label"
    v-model="internalValue"
    :error-messages="errorMessages"
    type="date"
  >
  </v-text-field>
</template>

<script>
export default {
  name: "InputDate",
  data() {
    return {
      model: null
    };
  },
  props: {
    label: { required: true },
    errorMessages: { required: true },
    value: { required: true }
  },
  computed: {
    internalValue: {
      get() {
        return this.value;
      },
      set(newVal) {
        if (this.value !== newVal) this.$emit("input", newVal);
      }
    }
  },
  methods: {},
  created() {}
};
</script>
