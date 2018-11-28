<template>
  <v-card>
    <!-- Cardヘッダー -->
    <v-toolbar card>
      <slot name="card-header-icon"></slot>
      <v-toolbar-title class="font-weight-light">
        <slot name="card-header-title"></slot>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- モーダルの挿入 -->
      <slot name="card-dialog"></slot>

      <v-dialog v-model="dialog" scrollable max-width="600px">
        <v-btn slot="activator" color="primary" dark class="mb-2">New Item (COM)</v-btn>
        <v-card>
          <v-card-title>
            <span class="headline">New Item</span>
          </v-card-title>
          <v-divider></v-divider>
          <!-- フォーム内容 -->
          <v-card-text>
            <v-container grid-list-md>

            </v-container>
          </v-card-text>
          <v-divider></v-divider>
          <!-- フォーム操作 -->
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="dialog = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </v-toolbar>

    <!-- Cardタイトル -->
    <v-card-title>
      <v-layout row wrap>
        <!-- ページネーション挿入用スロット -->
        <v-flex sm12 md5 lg4 d-flex>
          <slot name="table-pagination"></slot>
          <!-- トータルレコード表示 -->
          <v-subheader>
            Total : {{ count }} items
          </v-subheader>
        </v-flex>
        <v-flex sm12 md7 lg8>
          <!-- 検索バー挿入用スロット -->
          <slot name="table-search"></slot>
        </v-flex>
      </v-layout>
    </v-card-title>

    <!-- テーブル内容 -->
    <v-data-table
      :headers="headers"
      :items="items"
      :hide-actions="true"
      class="elevation-1"
      disable-initial-sort
    >
      <!-- headersに格納しているvalueをtdに割り振る -->
      <template slot="items" slot-scope="props">
        <td 
          v-for="(header, index) in headers"
          :key="index"
        >
          {{ props.item[header.value] }}
        </td>
      </template>
    </v-data-table>
    
    <!-- Cardフッター -->
    <v-footer 
      card
      height="auto"
    >
    </v-footer>
  </v-card>
</template>

<script>
export default {
  name: "CardTable",
  data() {
    return{
      dialog: false
    }
  },
  props: {
    // レコード数を取得
    count: { required: true },
    // テーブル情報表示
    headers: { required: true },
    items: { required: true }
  }
}
</script>
