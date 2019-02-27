<template>
  <span>
    <v-pagination
      v-model="page"
      :length="pageLength"
      :total-visible="5"
    ></v-pagination>
  </span>
</template>

<script>
export default {
  name: "pagination",
  data() {
    return {
      // ページ初期値
      page: 1
    };
  },
  props: {
    // ページネーション設定情報を取得
    length: { required: true },
    count: { required: true },
    // 親のモデル情報を取得する
    value: { required: true }
  },
  computed: {
    // データ数がゼロの場合でもpaginationを一つは表示する
    pageLength() {
      let l = 1;
      if (this.length >= 1) {
        l = this.length;
      }
      return l;
    }
  },
  watch: {
    // 親モデル変更時にデータを反映
    value() {
      this.page = this.value;
    }
  },
  updated() {
    // ページ変更時に親のバインドデータを更新する
    this.$emit("input", this.page);
  },
  mounted() {
    // ページ生成時に親コンポーネントのバインドデータを取得する
    this.page = this.value;
  }
};
</script>
