<template>
  <v-card>
    <v-toolbar card>
      <!-- カードヘッダータイトルスロット -->
      <slot name="card-header-icon"></slot>
      <v-toolbar-title class="font-weight-light">
        <slot name="card-header-title"></slot>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- 一覧へ戻るボタン -->
      <v-btn
        @click="backToList"
      >
        <v-icon>reply</v-icon>
        Back to List
      </v-btn>
    </v-toolbar>

    <v-card-title>
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
      <v-btn 
        color="darken-1"
        @click="clearData"
        outline
      >Clear Data</v-btn>
    </v-card-title>

    <!-- テーブル内容 -->
    <v-data-table
      :headers="headers"
      :items="excelJson"
      :hide-actions="true"
      class="elevation-1"
      disable-initial-sort
    >
      <template slot="items" slot-scope="props">
        <tr 
          class="dataList"
          :class="{
            'complete': props.item.updated,
            'error': props.item.err
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
              {{ props.item[header.value] | moneyDelemiter }}
            </template>
            <template v-else>
              {{ props.item[header.value] }}
            </template>
            
            <!-- 最終行のみ挿入可能スロットを追加する -->
            <div v-show="header.value == 'action'">
              <v-layout justify-center>
                <!-- 閲覧ボタン -->
                <v-btn
                  @click="upload(props.item)"
                  color="primary"
                  dark
                  :disabled="props.item.updated"
                >
                  Upload
                </v-btn>
              </v-layout>
            </div>

          </td>
        </tr>
      </template>
    </v-data-table>

    <slot name="card-body"></slot>
    
    <!-- Cardフッター -->
    <v-footer 
      card
      height="auto"
    >
    </v-footer>
  </v-card>
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
    errorColumn: { required: false }
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemConfig", ["excelJson"])
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
    }
  },
  created() {
    this.clearData();
  }
};
</script>

<style>
.complete, .complete * v-icon {
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
