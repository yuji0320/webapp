export default {
  computed: {
    // PDF用ヘッダー
    headerList() {
      return function (val) {
        let headerArray = [];
        for(let key in val){
          let headerCol = {
            "text": val[key].text,
            "alignment": "center"
          }
          headerArray.push(headerCol);
        }
        return headerArray;
      }
    }
  },
  methods: {
    createPdfData() {
      // PDFヘッダー
      let headerText = "Costing Reports search by period : " + this.date_from + " to " + this.date_to;
      // テーブル用リストの宣言
      let tablebody = [];
      // ヘッダー作成
      let tableHeader = this.headerList(this.headers);
      let tableWidths = [40, 180, 60, 45, 45, 45, 45, 35];
      tablebody.push(tableHeader);
      // テーブル内容作成
      for(var d=0,data;data=this.dataList[d];d++){
        // console.log(data);
        let dataRow = [];
        for(var h=0,head;head=this.headers[h];h++){
          // dataからヘッダーに該当するものを抜き出す
          let col = data[head.value];
          // データがネストしている場合はネスと先データを表示
          if(head.nest) {
            if(col) { col = col[head.nest];}
          }
          // データが右寄せ(数値)の場合は右寄せ処理
          if(head.class=="text-xs-right") {
            col = {"text": col, alignment: "right"};
          }
          // データが右寄せ(数値)の場合は中央寄せ処理
          if(head.class=="text-xs-center" && col) {
            col = {"text": col, alignment: "center"};
          }
          // データが未定義の場合はblankを入力
          if(!col) { col = ""; }
          dataRow.push(col);
        }
        tablebody.push(dataRow);
      }
      // テーブル定義
      let tableData = {
        table: {
          headerRows: 1,
          widths: tableWidths,
          body: tablebody
        }
      }
      // 出力データ整形
      let pdfData = {
        "headerText": headerText,
        "content": tableData,
        // "pageOrientation": "landscape"
      }
      return pdfData;
    }
  }
}