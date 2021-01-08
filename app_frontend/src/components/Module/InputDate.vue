<template>
  <v-text-field 
    :label="label"
    v-model="internalValue"
    :error-messages="errorMessages"
    :disabled="disabled"
    type="date"
    min="1900-01-01" 
    max="2100-12-31"
    :append-outer-icon="appendOuterIcon"
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
    errorMessages: { required: false },
    value: { required: true },
    disabled: { required: false },
    appendOuterIcon: { required: false },
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
