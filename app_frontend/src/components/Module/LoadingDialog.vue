<template>
  <div class="text-xs-center">
    <v-dialog
      v-model="isLoading"
      hide-overlay
      persistent
      width="300"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text>
          Now loading...
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "LoadingDialog",
  props: {
    loading: { required: false },
    loadingModel: { required: false },
  },
  computed: {
    isLoading() {
      if(this.loading) {
        return this.loadingModel
      } else {
        return this.$store.state.systemConfig.loading
      }
    }
  }
}
</script>

<style>

</style>
