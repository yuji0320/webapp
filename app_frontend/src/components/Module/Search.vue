<template>
  <v-layout row wrap justify-end>
    <v-flex xs12 sm4 lg3 d-inline>
      <!-- 検索カラムの指定 -->
      <v-select
        v-model="incremental.tableSelectValue"
        :items="incremental.tableSelectItems"
        item-text="text"
        item-value="value"
        label="Select value"
      ></v-select>
    </v-flex>
    <v-flex xs12 sm8 lg5 d-inline-flex>
      <!-- 検索文字列の入力 -->
      <v-text-field
        v-model="incremental.tableSearch"
        append-icon="search"
        label="Search"
        hide-details
      ></v-text-field>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: "search",
  data() {
    return {
      // ページ初期値
      incremental: {}
    };
  },
  props: {
    // 親のモデル情報を取得する
    value: { required: true }
  },
  updated() {
    // ページ変更時に親のバインドデータを更新する
    this.$emit("input", this.incremental)
  },
  mounted() {
    // ページ生成時に親コンポーネントのバインドデータを取得する
    this.incremental = this.value
    // console.log(this.value)
  }
};
</script>
