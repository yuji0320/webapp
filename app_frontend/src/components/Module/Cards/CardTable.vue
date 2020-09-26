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
      <slot name="card-header-button" class=""></slot>
      <slot name="card-dialog" class=""></slot>
    </v-app-bar>

    <v-card flat>
      <slot name="search-bar"></slot>

      <!-- 修正可能テーブルの表示の際 -->
      <span v-if="editableCard">
        <slot name="editable-card"></slot>
      </span>
      
      <!-- テーブル表示の場合 -->
      <span v-else>
        <!-- テーブル内容 -->
        <v-data-table
          :items-per-page="50"
          :headers="headers"
          :items="items"
          :loading="$store.state.systemConfig.loading"
          v-model="selected"
          item-key="id"
          :show-select="selectAll"
          class="elevation-1"
          hide-default-footer
          disable-sort
          dense
        >
          <!-- テーブルデータ -->
          <template v-slot:item="props">
            <!-- 特定ステータスを保持している場合はtrにクラスを付与 -->
            <tr
              :class="{
              'complete': props.item[completeColumn],
              'error': props.item[errorColumn],
              'dataList': true,
              'printed': props.item.isPrinted
              }"
              @dblclick="doubleClick(props.item)"
            >
              <!-- SelectAllがTrueの場合はチェックボックスを表示する -->
              <td v-if="selectAll">
                <v-checkbox 
                  :input-value="props.isSelected" 
                  @change="props.select($event)"
                  hide-details 
                  style="margin:0px;padding:0px" 
                  :disabled="addClass(props.item.isPrinted) || disabledActions(props.item[completeColumn])"
                />
              </td>

              <!-- チェックボックス以外のtd要素 -->
              <td 
                v-for="(header, index) in headers"
                :key="index"
                :class="header.class"
                :align="header.align"
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
                  <!-- データを表示 -->
                  {{ props.item[header.value] }}
                </template>

                <!-- チェックボックスがTrueの場合は表示(selectAllをfalseにする場合) -->
                <div v-if="header.value === 'checkbox'">
                  <v-checkbox 
                    :input-value="props.isSelected" 
                    @change="props.select($event)"
                    hide-details 
                    style="margin:0px;padding:0px" 
                    :disabled="addClass(props.item.isPrinted) || disabledActions(props.item[completeColumn])"
                  />
                </div>

                <!-- 最終行のみ挿入可能スロットを追加する -->
                <div v-show="header.value === 'action'">
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
                      v-show="!editDisabled"
                    >
                      edit
                    </v-icon>
                    <!-- 削除ボタン -->
                    <v-icon
                      small
                      class="mr-2"
                      @click="deleteItem(props.item)"
                      v-show="!editDisabled"
                    >
                      delete
                    </v-icon>
                  </v-layout>
                </div>
              </td>            
            </tr>
          </template>
        </v-data-table>
      </span>

      <slot name="bottom-contents"></slot>

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
      expand: false,
      selected: []
    };
  },
  props: {
    // テーブル情報表示
    headers: { required: false },
    items: { required: false },
    completeColumn: { required: false },
    errorColumn: { required: false },
    viewIcon: { required: false },
    selectAll: { required: false },
    doNotChangeClass: { required: false },
    completeDisabled: { required: false },
    editDisabled: { required: false },
    editableCard: { required: false },
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