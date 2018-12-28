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
    </v-toolbar>

    <!-- Cardタイトル -->
    <v-card-title>
      <v-layout row wrap>
        <v-flex sm12 md12 lg12>
          <slot name="search-bar"></slot>
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
          

          <!-- 最終行のみ挿入可能スロットを追加する -->
          <div v-if="header.value == 'action'">
            <v-layout justify-center>
              <!-- 編集ボタン -->
              <v-icon
                small
                class="mr-2"
                @click="editItem(props.item)"
              >
                edit
              </v-icon>
              <!-- 削除ボタン -->
              <v-icon
                small
                class="mr-2"
                @click="deleteItem(props.item)"
              >
                delete
              </v-icon>
            </v-layout>
          </div>
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
    return {};
  },
  props: {
    // テーブル情報表示
    headers: { required: true },
    items: { required: true }
  },
  methods: {
    // データ編集イベントの発火
    editItem(item) {
      // console.log(item);
      this.$emit("edit-item", item);
    },
    // データ削除イベントの発火
    deleteItem(item) {
      // console.log(item);
      item.delete = "ture";
      this.$emit("delete-item", item);
    }
  }
};
</script>
