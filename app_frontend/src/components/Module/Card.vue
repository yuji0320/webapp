<template>
  <v-card>
    <!-- Cardヘッダー -->
    <v-toolbar card>
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
    </v-toolbar>

    <!-- 注意書き -->
<!--    このスロットを追加すると検索バーが下がる-->
<!--    <v-card-text>-->
<!--      <slot name="card-text"></slot>-->
<!--    </v-card-text>-->

    <!-- Cardタイトル -->
    <v-card-title>
      <v-layout row wrap>
        <v-flex xs12>
          <!-- 検索バー表示スロット -->
          <slot name="search-bar"></slot>
        </v-flex>
        <v-flex xs12>
          <!-- タブ表示用スロット -->
          <slot name="card-tabs"></slot>
        </v-flex>
        <v-flex xs12>
          <!-- テキスト挿入用スロット -->
          <slot name="card-title-text"></slot>
        </v-flex>
      </v-layout>
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

}
</script>

<style>

</style>
