<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :hide-actions="true"
    class="elevation-1 mb-4"
    disable-initial-sort
    :loading="$store.state.systemConfig.loading"
    v-model="selected"
    :select-all="selectAll"
    item-key="id"
  >
    <!-- テーブルデータ -->
    <template slot="items" slot-scope="props">
      <!-- 特定ステータスを保持している場合はtrにクラスを付与 -->
      <tr
        :class="{
          'complete': addClass(props.item[completeColumn]),
          'error': props.item[errorColumn],
          'dataList': true,
          'printed': addClass(props.item.isPrinted),
          'selected': addClass(props.selected)
        }"
        @dblclick="doubleClick(props.item)"
        :active="props.selected"
      >
        <td v-if="selectAll">
          <v-checkbox
            v-model="props.selected"
            primary
            hide-details
            :disabled="addClass(props.item.isPrinted)"
          ></v-checkbox>
        </td>  
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
          <!-- チェックボックスがTrueの場合は表示(selectAllをfalseにする場合) -->
          <template v-else-if="header.value === 'checkbox'">
            <v-checkbox
              v-model="props.selected"
              primary
              hide-details
              :disabled="addClass(props.item.isPrinted) || disabledActions(props.item[completeColumn])"
            ></v-checkbox>
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
                :disabled="disabledActions(props.item[completeColumn])"
                v-show="!editDisabled"
              >
                edit
              </v-icon>
              <!-- 削除ボタン -->
              <v-icon
                small
                class="mr-2"
                @click="deleteItem(props.item)"
                :disabled="disabledActions(props.item[completeColumn])"
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
import { mapState, mapActions } from "vuex";

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
