<template>
  <app-card>
    <span slot="card-header-icon"><slot name="card-header-icon"></slot></span>
    <span slot="card-header-title"><slot name="card-header-title"></slot></span>
    <span slot="card-header-button">
      <v-btn
        v-show="!hideBackButton"
        @click="backToList"
      >
        <v-icon>reply</v-icon>
        Back to List
      </v-btn>
      <v-btn
        @click="submitAllData"
        color="primary"
        v-if="submitAll"
        :disabled="disabledSubmitAll"
        class="ml-2"
      >
        <v-icon></v-icon>
        Submit All
      </v-btn>
    </span>

    <span slot="search-bar">
      <v-row class="ps-2">
      <!-- データ読み込み用HTML部分 -->
      <v-text-field label="Select xlsx file" @click="pickFile" v-model="dataName" prepend-icon="attach_file"></v-text-field>
      <input 
        type="file"
        style="display: none"
        ref="data"
        @change="onFilePicked"
        class="inputFile"
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        v-if="view"
      >
      <v-icon 
        color="darken-1"
        @click="clearData"
        outlined
      >clear</v-icon>
      </v-row>
    </span>

    <span slot="card-content">
      <!-- テーブル内容 -->
      <v-data-table
        :items-per-page="itemPerPage"
        :headers="headers"
        :items="excelJson"
        hide-default-footer
        class="elevation-1"
        dense
      >
        <template v-slot:item="item">
          <tr 
            class="dataList"
            :class="{
              'complete': item.item.updated,
              'error': item.item.err
            }"
          >
            <td 
              v-for="(header, index) in headers"
              :key="index"
              :class="header.class"
            >
              <template 
                v-if="header.money"
              >
                {{ item.item[header.value] | moneyDelemiter }}
              </template>
              <template v-else>
                {{ item.item[header.value] }}
              </template>
              
              <!-- 最終行のみ挿入可能スロットを追加する -->
              <div v-show="header.value == 'action'">
                <v-layout justify-center>
                  <!-- 閲覧ボタン -->
                  <v-btn
                    @click="upload(item.item)"
                    color="primary"
                    dark
                    x-small
                    :disabled="item.item.updated"
                  >
                    Upload
                  </v-btn>
                </v-layout>
              </div>

            </td>
          </tr>
        </template>
      </v-data-table>
    </span>
    
  </app-card>
</template>

<script>
import XLSX from "xlsx";
import { mapState, mapActions } from "vuex";

export default {
  name: "excelUpload",
  data: function() {
    return {
      dataName: "",
      view: true
    };
  },
  props: {
    headers: { required: true },
    errorColumn: { required: false },
    submitAll: { required: false },
    hideBackButton: { required: false },
    itemPerPageManual: { required: false },
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemConfig", ["excelJson"]),
    disabledSubmitAll() {
      if(this.excelJson.length === 0) {
        return true
      } else {
        return false
      }
    },
    itemPerPage() {
      let itemPerPage = 500
      if(this.itemPerPageManual) {
        itemPerPage = this.itemPerPageManual
      }
      return itemPerPage
    }
  },
  methods: {
    ...mapActions("systemConfig", ["setExcelJson"]),
    // ファイルの読み込み
    pickFile() {
      this.$refs.data.click();
    },
    // エクセル入力
    onFilePicked(e) {
      var files = e.target.files;
      var file = files[0];
      this.dataName = file.name;

      // 読み込みデータを処理関数へ飛ばす
      var reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onloadend = file => this.readFile(file.target.result);
    },
    // エクセルファイルの読み取り
    readFile(data) {
      let workbook;
      let arr = this.fixData(data);

      // ワークブック読み込み
      workbook = XLSX.read(btoa(arr), {
        type: "base64",
        cellDates: true
      });

      var output = "";
      var fixedJson = [];
      output = this.toJson(workbook);
      this.fixJson(output);
    },
    // ファイルの読み込み
    fixData(data) {
      var o = "",
        l = 0,
        w = 10240;
      for (; l < data.byteLength / w; ++l)
        o += String.fromCharCode.apply(
          null,
          new Uint8Array(data.slice(l * w, l * w + w))
        );
      o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
      return o;
    },
    // ワークブックのデータをjsonに変換
    toJson(workbook) {
      var result = {};
      workbook.SheetNames.forEach(function(sheetName) {
        var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
          raw: true
        });
        if (roa.length > 0) {
          result[sheetName] = roa;
        }
      });
      return result;
    },
    // 親コンポーネントにデータを送り、データ内容をチェックする
    fixJson(json) {
      let jsonArray = json.Sheet1;
      if(!json.Sheet1){
        // シート名が特殊な場合は最初のシートを読み込む
        let sheet1Name = Object.keys(json)[0]
        jsonArray = json[sheet1Name];
      }
      let fixedData = this.$emit("fix-json", jsonArray);
    },
    // 一覧へ戻る
    backToList() {
      this.$emit("back-to-list");
    },
    clearData() {
      // データを破棄
      this.dataName = "";
      // Vuexデータ破棄
      this.setExcelJson([]);
      // v-ifでinputを破棄し、DOMを更新
      this.view = false
      this.$nextTick(function () {
        this.view = true
      })
    },
    // データ登録処理
    async upload(item) {
      this.$emit("submit-data", item);
    },
    // データ全件登録処理
    async submitAllData() {
      this.$emit("submit-all", );
      // console.log("submitall");
    }
  },
  created() {
    this.clearData();
  }
};
</script>

<style>
/* .complete, .complete * v-icon {
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
} */
</style>
