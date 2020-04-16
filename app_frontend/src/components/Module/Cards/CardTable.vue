<template>
  <v-card class="ma-2">
    <v-app-bar flat>
      <!-- ヘッダー表示挿入 -->
      <slot name="card-header-icon"></slot>
      <v-toolbar-title class="font-weight-light title">
        <slot name="card-header-title"></slot>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- ボタン挿入 -->
      <slot name="card-header-button" class=""></slot>
    </v-app-bar>


    <v-card>

      <slot name="search-bar"></slot>
      <!-- Cardタイトル -->
      <!-- <v-card-title>
        <slot name="search-bar"></slot>
      </v-card-title> -->

      <!-- テーブル内容 -->
      <v-data-table
        :items-per-page="items.length"
        :headers="headers"
        :items="items"
        :loading="$store.state.systemConfig.loading"
        class="elevation-1"
        hide-default-footer
        dense
      >

        <!-- テーブルデータ -->
        <template v-slot:item="item">
          <!-- 特定ステータスを保持している場合はtrにクラスを付与 -->
          <tr
            :class="{
            'complete': item.item[completeColumn],
            'error': item.item[errorColumn],
            'dataList': true,
            'printed': item.item.isPrinted
            }"
            @dblclick="doubleClick(item)"
          >
            <td 
              v-for="(header, index) in headers"
              :key="index"
              :class="header.class"
            >
              <!-- 文字列がtrueの場合緑チェック -->
              <template v-if="item.item[header.value] === true">
                <v-icon color="green">check</v-icon>
              </template>
              <!-- 文字列がtrueの場合赤バツ -->
              <template v-else-if="item.item[header.value] === false">
                <v-icon color="red">close</v-icon>
              </template>
              <!-- true, false以外の場合はデータを表示 -->
              <template v-else>
                <!-- jsonがネストしている場合はデータを抽出 -->
                <template v-if="header.nest">
                  <template v-if="header.nestNest">
                    <template v-if="item.item[header.value]">
                      {{ item.item[header.value][header.nest][header.nestNest] }}
                    </template>
                  </template>
                  <template v-else>
                    <!-- ネスト元データが存在する場合のみ表示 -->
                    <template v-if="item.item[header.value]">
                      {{ item.item[header.value][header.nest] }}
                    </template>
                  </template>
                </template>
                <!-- ネストしていない場合はデータを表示 -->
                <template v-else>
                  {{ item.item[header.value] }}
                </template>
              </template>
              <!-- 最終行のみ挿入可能スロットを追加する -->
              <div v-show="header.value === 'action'">
                <v-layout justify-center>
                  <!-- 閲覧ボタン -->
                  <v-icon
                    small
                    class="mr-2"
                    @click="viewItem(item.item)"
                    v-if="viewIcon"
                  >
                    visibility
                  </v-icon> 
                  <!-- 編集ボタン -->
                  <v-icon
                    small
                    class="mr-2"
                    @click="editItem(item.item)"
                  >
                    edit
                  </v-icon>
                  <!-- 削除ボタン -->
                  <v-icon
                    small
                    class="mr-2"
                    @click="deleteItem(item.item)"
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
      <v-footer card height="auto">
      </v-footer>

    </v-card>
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
    headers: { required: false },
    items: { required: false },
    completeColumn: { required: false },
    errorColumn: { required: false },
    viewIcon: { required: false }
  },
  methods: {
    doubleClick(item) {
      this.$emit("double-click", item);
    },
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