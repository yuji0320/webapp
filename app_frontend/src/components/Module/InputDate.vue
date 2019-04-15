<template>
  <v-text-field 
    :label="label"
    v-model="internalValue"
    :error-messages="errorMessages"
    hint="YYYY/MM/DD format"
    persistent-hint
    type="date"
    min="1900-01-01" 
    max="2100-12-31"
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
