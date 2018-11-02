<!-- フッター -->
<template>
    <v-footer :fixed="fixed">
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
