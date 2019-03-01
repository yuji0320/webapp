<template>
  <div>
    <!-- データ出力用HTML部分 -->
    <!-- <button type="button" v-on:click="onexport">Excel download</button> -->
    <v-btn
      fab
      small
      flat
      @click="checkModel"
    >
      <v-icon>cloud_download</v-icon>
    </v-btn>
  </div>
</template>


<script>
import XLSX from "xlsx";

export default {
  name: "excelDownload",
  data: function() {
    return {
      model: this.value
    };
  },
  props: {
    fileName: { required: true },
    // 親のモデル情報を取得する
    value: { required: true }
  },
  computed: {
    // ファイル名と日付を結合して返す
    exportFileName() {
      let today = new Date();
      let y = today.getFullYear();
      let m = today.getMonth() + 1;
      let d = today.getDate();
      let h = today.getHours();
      let min = today.getMinutes();
      let s = today.getSeconds();
      m = ('0' + m).slice(-2);
      d = ('0' + d).slice(-2);
      let dateNow = y + "" + m + "" + d + "" + h + "" + min + "" + s;
      return this.fileName + "_" + dateNow + ".xlsx";
    }
  },
  methods: {
    // エクセル出力
    onExport() {
      // jsonデータをワークシートに代入
      var WS = XLSX.utils.json_to_sheet(this.model);

      // エクセルワークブックを作成
      var wb = XLSX.utils.book_new(); // make Workbook of Excel

      // ワークブックにサークシートを代入
      XLSX.utils.book_append_sheet(wb, WS, "sheet1");

      // エクセル出力
      XLSX.writeFile(wb, this.exportFileName);
    },
    checkModel() {
      console.log(this.model);
      // console.log(this.exportFileName);
    }
  }
};
</script>
