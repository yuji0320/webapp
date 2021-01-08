<template>
  <v-card class="ma-2">
    <!-- Cardヘッダー -->
    <v-app-bar flat>
      <!-- ヘッダー表示挿入 -->
      <slot name="card-header-icon"></slot>
      <v-toolbar-title class="font-weight-light title">
        <slot name="card-header-title"></slot>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- ボタン挿入 -->
      <slot name="card-header-button"></slot>
    </v-app-bar>

    <!-- Cardタイトル -->
    <v-card-title v-show="!noSearchBar">
      <v-row>
        <v-col cols="12">
          <!-- 検索バー表示スロット -->
          <slot name="search-bar"></slot>
        </v-col>
      </v-row>
    </v-card-title>

    <v-card-text>
      <!-- カードコンテンツ表示スロット -->
      <slot name="card-content"></slot>
    </v-card-text>

    <!-- Cardフッター -->
    <v-footer card height="auto">
      <v-spacer></v-spacer>
      <slot name="card-footer-button"></slot>
    </v-footer>

  </v-card>
</template>

<script>
export default {
  props: {
    noSearchBar: { required: false },
  }
}
</script>

<style>

</style>
