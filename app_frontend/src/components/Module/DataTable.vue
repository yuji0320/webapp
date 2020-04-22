<template>
  <v-data-table
    v-model="selected"
    :headers="headers"
    :items="items"
    item-key="id"
    show-select
    :loading="$store.state.systemConfig.loading"
    class="elevation-1 mb-4"
    disable-sort
    hide-default-footer
  >

    <!-- テーブルデータ -->
    <template v-slot:item="{item}">
      <!-- 特定ステータスを保持している場合はtrにクラスを付与 -->
      <tr
        :class="{
          'complete': addClass(item[completeColumn]),
          'error': item[errorColumn],
          'dataList': true,
          'printed': addClass(item.isPrinted),
          'selected': addClass(selected)
        }"
        @dblclick="doubleClick(item)"
        :active="selected"
      >
        <td 
          v-for="(header, index) in headers"
          :key="index"
          :class="header.class"
        >
          <!-- 文字列がtrueの場合緑チェック -->
          <template v-if="item[header.value] === true">
            <v-icon color="green">check</v-icon>
          </template>
          <!-- 文字列がtrueの場合赤バツ -->
          <template v-else-if="item[header.value] === false">
            <v-icon color="red">close</v-icon>
          </template>
          <!-- チェックボックスがTrueの場合は表示(selectAllをfalseにする場合) -->
          <!-- <template v-else-if="header.value === 'checkbox'">
            <v-checkbox
              v-model="selected"
              primary
              hide-details
              :disabled="addClass(item.isPrinted) || disabledActions(item[completeColumn])"
            ></v-checkbox>
          </template> -->
          <!-- true, false以外の場合はデータを表示 -->
          <template v-else>
            {{ item[header.value] }}
          </template>

          <!-- 最終行のみ挿入可能スロットを追加する -->
          <div v-show="header.value === 'action'">
            <v-layout justify-center>
              <!-- 閲覧ボタン -->
              <v-icon
                small
                class="mr-2"
                @click="viewItem(item)"
                v-if="viewIcon"
              >
                visibility
              </v-icon> 
              <!-- 編集ボタン -->
              <v-icon
                small
                class="mr-2"
                @click="editItem(item)"
                :disabled="disabledActions(item[completeColumn])"
                v-show="!editDisabled"
              >
                edit
              </v-icon>
              <!-- 削除ボタン -->
              <v-icon
                small
                class="mr-2"
                @click="deleteItem(item)"
                :disabled="disabledActions(item[completeColumn])"
                v-show="!editDisabled"
              >
                delete
              </v-icon>
            </v-layout>
          </div>
        </td>
      </tr>
    </template>
    <!-- フッター -->
    <template v-slot:footer v-if="footer">
      <td :colspan="headers.length" class="text-xs-right">
        <slot name="data-table-footer"></slot>
      </td>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: "DataTable",
  data() {
    return {
      selected: []
    };
  },
  props: {
    // テーブル情報表示
    headers: { required: true },
    items: { required: true },
    footer: { required: false },
    completeColumn: { required: false },
    errorColumn: { required: false },
    viewIcon: { required: false },
    doNotChangeClass: { required: false },
    checkbox: { required: false },
    selectAll: { required: false },
    completeDisabled: { required: false },
    editDisabled: { required: false },
  },
  computed: {
    addClass() {
      return function (val) {
        if(!this.doNotChangeClass) {
          return val
        }
      }
    },
    disabledActions() {
      return function (val) {
        if(this.completeDisabled && val) {
          return true
        } else {
          return false
        }
      }     
    }
  },
  methods: {
    // ダブルクリック時の処理
    doubleClick(item) {
      if(!this.disabledActions(item.suspenseReceivedDate)) {
        this.$emit("double-clicked", item);
      }
      // console.log(item);
    },
    // データ閲覧イベントの発火
    viewItem(item) {
      this.$emit("view-item", item);
    },
    // データ編集イベントの発火
    editItem(item) {
      this.$emit("edit-item", item);
    },
    // データ削除イベントの発火
    deleteItem(item) {
      item.delete = "ture";
      this.$emit("delete-item", item);
    }
  },
  created() {}
}
</script>

<style>
.printed, .complete, .complete * v-icon {
  background-color: #4CAF50;
  color: white;
}

.suspenseComplete {
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

.selected {
  color: black;
}
</style>
