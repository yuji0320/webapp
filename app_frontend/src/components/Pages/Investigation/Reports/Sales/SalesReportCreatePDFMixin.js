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
    // 印刷用データ作成
    createPdfData(text) {
      // PDFヘッダー
      let headerText = text;
      // テーブル用リストの宣言
      let tablebody = [];
      // ヘッダー作成
      let tableHeader = this.headerList(this.headers);
      let tableWidths = [40, 200, 70, 70, 50, 90]
      tablebody.push(tableHeader);
      // テーブル内容作成
      for(var s=0,summary;summary=this.summaryList[s];s++){
        // 作業指図書データの展開
        for(var d=0,data;data=summary.dataList[d];d++){
          // 行オブジェクトの定義
          let dataRow = [];
          // テーブルヘッダーを展開
          for(var h=0,head;head=this.headers[h];h++){
            // dataからヘッダーに該当するものを抜き出す
            let col = data[head.value];
            // データがネストしている場合はネスと先データを表示
            if(head.nest) {
              if(col) { col = col[head.nest];}
            }
            // 金額に通貨記号を付与
            if(head.value == "defaultCurrencyOrderAmount") {
              col = this.loginUserData.defaultCurrencyDisplay + " " + col 
            }
            // データが右寄せ(数値)の場合は右寄せ処理
            if(head.class=="text-xs-right") {
              col = {"text": col, alignment: "right"}
            }
            // データが未定義の場合はblankを入力
            if(!col) { col = ""; }
            dataRow.push(col);
          }
          // テーブルデータに行を追加
          tablebody.push(dataRow);
        }
        // 集計単位ごとの小計を表示
        let subTotalText = summary.value + "   Total : ";
        let subTotal = this.loginUserData.defaultCurrencyDisplay + " " + summary.subTotal.toString().replace(/(\d)(?=(\d{3})+($|\.\d+))/g , '$1,');
        let subtotalRow = [
          { colSpan: 5, text:subTotalText, alignment:"right", bold:true },'','','','',
          { text: subTotal , alignment:"right", bold:true }
        ]
        tablebody.push(subtotalRow);
      }
      // 合計表示
      let total = this.loginUserData.defaultCurrencyDisplay + " " + this.totalPrice.toString().replace(/(\d)(?=(\d{3})+($|\.\d+))/g , '$1,');
      let totalRow = [
        { colSpan: 5, text:"Grand Total : ", alignment:"right", bold:true },'','','','',
        { text: total , alignment:"right", bold:true }
      ]
      tablebody.push(totalRow);
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
        "content": tableData
      }
      return pdfData;
    },
  }
}