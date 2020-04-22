<template>
  <v-card class="ma-2">
    <!-- Cardヘッダー -->
    <v-app-bar flat>
      <slot name="card-header-icon"></slot>
      <!-- <v-icon>list</v-icon> -->
      <v-toolbar-title class="font-weight-light">
        <slot name="card-header-title"></slot>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- 戻るボタン挿入 -->
      <slot name="card-header-buck-button"></slot>
      <!-- モーダルの挿入 -->
      <slot name="card-dialog"></slot>
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
        <!-- <v-col cols="12"> -->
          <!-- タブ表示用スロット -->
          <!-- <slot name="card-tabs"></slot> -->
        <!-- </v-col> -->
        <!-- <v-col cols="12"> -->
          <!-- テキスト挿入用スロット -->
          <!-- <slot name="card-title-text"></slot> -->
        <!-- </v-col> -->
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
