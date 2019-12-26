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
      let headerText = "Purchasing Reports search by period : " + this.date_from + " to " + this.date_to;
      // テーブル用リストの宣言
      let tablebody = [];
      let headerData = [];
      let tableWidths = [];
      // 表示方法によるデータ構成
      if(this.isDetail) {
        // 詳細表示の場合
        headerData = this.headers;
        tableWidths = [60, 130, 50, 80, 50, 30, 50, 50];
        // ヘッダーの整形、追加
        tablebody.push(this.headerList(headerData));
        // コンテンツの入力
        // 集計種別毎にデータ整形
        for(var d=0,data;data=this.summaryList[d];d++){
          // 整形データの入力
          // console.log(data.dataList);
          tablebody = tablebody.concat(this.createDataList(headerData, data.dataList));
          // 集計結果毎の小計を挿入
          let subTotalRow = [
            {text: "Sub Total of " + data.value, alignment:"right", colSpan: 7, decoration: 'underline'},
            {}, {}, {}, {}, {}, {}, 
            {text: data.subTotal, alignment:"right", decoration: 'underline'}
          ];
          tablebody.push(subTotalRow);
        }
        // 総合計を挿入
        let total = this.loginUserData.defaultCurrencyDisplay + " " + this.moneyComma(this.totalPrice);
        console.log(total);
        let grandTotalRow = [
          {text: "Grand Total ", alignment:"right", colSpan: 7, decoration: 'underline', decorationStyle: 'double'},
          {}, {}, {}, {}, {}, {}, 
          {text: total, alignment:"right", decoration: 'underline', decorationStyle: 'double'}
        ];
        tablebody.push(grandTotalRow);
      } else {
        // 合計表示の場合
        headerData = this.headersSummary;
        tableWidths = [200,100];
        // ヘッダーの整形、追加
        tablebody.push(this.headerList(headerData));
        // コンテンツの入力
        tablebody = tablebody.concat(this.createDataList(headerData, this.summaryList));
        let totalPrice = this.loginUserData.defaultCurrencyDisplay + " " + this.moneyComma(this.totalPrice.toFixed(2));
        let glandTotal = [
          { text:"Grand Total", alignment: "left"},
          { text:totalPrice, alignment: "right"},
        ];
        tablebody.push(glandTotal);
        // console.log(tablebody);
      }
      // テーブル定義
      let tableData = {
        table: {
          headerRows: 1,
          widths: tableWidths,
          body: tablebody,
          alignment: "justify",
        }
      }
      // 出力データ整形
      let pdfData = {
        "headerText": headerText,
        "content": tableData,
      }
      return pdfData;
    },
    createDataList(header, dataList) {
      let tablebodyData = [];
      // テーブル内容作成
      for(var d=0,data;data=dataList[d];d++){
        // console.log(data);
        let dataRow = [];
        for(var h=0,head;head=header[h];h++){
          // dataからヘッダーに該当するものを抜き出す
          let col = data[head.value];
          // データがネストしている場合はネスと先データを表示
          if(head.nest) {
            // さらにネストしており、親データが存在する場合
            if(head.nestNest && col[head.nest]) {
              if(col) { col = col[head.nest][head.nestNest]};
            } else {
              // 一階層のみの場合
              if(col) { col = col[head.nest];};
            }
          }
          // データが右寄せ(数値)の場合は右寄せ処理
          if(head.class=="text-xs-right" && col) {
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
        tablebodyData.push(dataRow);
      }
      return tablebodyData;
    }
  }
}