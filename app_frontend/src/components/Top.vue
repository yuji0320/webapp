<template>
  <div>
    <!-- ヘッダー -->
    <app-header class="no_print"></app-header>
    <!-- グローバルsnackbar -->
    <app-snackbar></app-snackbar>
    <!-- メインコンテンツ -->
    <router-view></router-view>
    <!-- フッター -->
    <app-footer></app-footer>
  </div>
</template>

<script>
// コンポーネントの読み込み
import Header from "@/components/Elements/Header.vue";
import Footer from "@/components/Elements/Footer.vue";
import Snackbar from "@/components/Module/Snackbar.vue";

import { mapActions } from "vuex";

export default {
  name: "Top",
  data() {
    return {};
  },
  methods: {
    ...mapActions("auth", ["userData"]),
    getUserData: function() {
      this.userData();
    }
  },
  mounted() {
    this.getUserData();
  },
  components: {
    "app-header": Header,
    "app-footer": Footer,
    "app-snackbar": Snackbar,
  }
};
</script>
