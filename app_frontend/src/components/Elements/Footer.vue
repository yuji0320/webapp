<!-- フッター -->
<template>
    <v-footer
      app
      inset
    >
      <v-layout justify-center>
        &copy;2018 — <strong>Shilia</strong>
      </v-layout>
    </v-footer>
</template>

<script>
export default {
  name: "Footer",
  data() {
    return {
      fixed: true
    };
  }
};
</script>
