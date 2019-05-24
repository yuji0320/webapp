<template>
  <v-card>
    <!-- Cardヘッダー -->
    <v-toolbar card>
      <slot name="card-header-icon"></slot>
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

    <!-- Cardタイトル -->
    <v-card-title>
      <v-layout row wrap>
        <v-flex sm12 md12 lg12>
          <slot name="search-bar"></slot>
        </v-flex>
        <v-flex sm12 md12 lg12>
          <!-- タブ表示用スロット -->
          <slot name="card-tabs"></slot>
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
      :loading="$store.state.systemConfig.loading"
    >

      <!-- headersに格納しているvalueをtdに割り振る -->
      <template slot="items" slot-scope="props">
        <!-- 親コンポーネントでしていたカラムが正の時クラスを指定してアクティブに -->
        <tr
          :class="{
            'complete': props.item[completeColumn],
            'error': props.item[errorColumn],
            'dataList': true,
            'printed': props.item.isPrinted
          }"
          @dblclick="editItem(props.item)"
        >
          <td 
            v-for="(header, index) in headers"
            :key="index"
            :class="header.class"
          >
            <!-- 文字列がtrueの場合緑チェック -->
            <template v-if="props.item[header.value] === true">
              <v-icon color="green">check</v-icon>
            </template>
            <!-- 文字列がtrueの場合赤バツ -->
            <template v-else-if="props.item[header.value] === false">
              <v-icon color="red">close</v-icon>
            </template>
            <!-- true, false以外の場合はデータを表示 -->
            <template v-else>
              <!-- jsonがネストしている場合はデータを抽出 -->
              <template v-if="header.nest">
                <template v-if="header.nestNest">
                  <template v-if="props.item[header.value]">
                    {{ props.item[header.value][header.nest][header.nestNest] }}
                  </template>
                </template>
                <template v-else>
                  <!-- ネスト元データが存在する場合のみ表示 -->
                  <template v-if="props.item[header.value]">
                    {{ props.item[header.value][header.nest] }}
                  </template>
                </template>
              </template>
              <!-- ネストしていない場合はデータを表示 -->
              <template v-else>
                {{ props.item[header.value] }}
              </template>
            </template>

            <!-- 最終行のみ挿入可能スロットを追加する -->
            <div v-show="header.value == 'action'">
              <v-layout justify-center>
                <!-- 閲覧ボタン -->
                <v-icon
                  small
                  class="mr-2"
                  @click="viewItem(props.item)"
                  v-if="viewIcon"
                >
                  visibility
                </v-icon> 
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
        </tr>
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
import { mapState, mapActions } from "vuex";

export default {
  name: "CardTable",
  data() {
    return {
      loading: false,
      expand: false
    };
  },
  props: {
    // テーブル情報表示
    headers: { required: true },
    items: { required: true },
    completeColumn: { required: false },
    errorColumn: { required: false },
    viewIcon: { required: false }
  },
  methods: {
    // データ閲覧イベントの発火
    viewItem(item) {
      // console.log(item);
      this.$emit("view-item", item);
    },
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

<style>
.printed, .complete, .complete * v-icon {
  background-color: #4CAF50;
  color: white;
}

.error {
  background-color: #fb8c;
  color: white;
}

.dataList:hover {
  background-color: #607d8b;
  color: black;
}
</style>
