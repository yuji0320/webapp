<template>
  <span>
    <!-- データ出力用HTML部分 -->
    <!-- <button type="button" v-on:click="onexport">Excel download</button> -->
    <v-btn
      fab
      small
      @click="exportExcel"
    >
      <v-icon>cloud_download</v-icon>
    </v-btn>
  </span>
</template>


<script>
import XLSX from "xlsx";

export default {
  name: "excelDownload",
  data: function() {
    return {

    };
  },
  props: {
    fileName: { required: true },
    // 親のモデル情報を取得する
    // value: { required: true }
  },
  computed: {},
  methods: {
    // エクセル出力
    onExport(val) {
      let excelFileName = this.exportFileName(this.fileName) + ".xlsx";
      // jsonデータをワークシートに代入
      var WS = XLSX.utils.json_to_sheet(val);

      // エクセルワークブックを作成
      var wb = XLSX.utils.book_new(); // make Workbook of Excel

      // ワークブックにワークシートを代入
      XLSX.utils.book_append_sheet(wb, WS, "sheet1");

      // エクセル出力
      XLSX.writeFile(wb, excelFileName);
    },
    exportExcel() {
      this.$emit("export-excel");
      // console.log(this.exportFileName(this.fileName));
    }
  }
};
</script>
