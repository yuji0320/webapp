export default {
  computed: {
    // PDF用ヘッダーデータ
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
    createPrintData(val) {
      // PDFヘッダー
      let headerText = "Bill of Material _"+ this.jobOrder.mfgNo + "-" + this.jobOrder.name;
      // 印刷用テーブルデータ作成
      let contentList = [];
      for(let p=0,page;page=val.data[p];p++){
        // 部品カテゴリ名設定
        let text = {
          text: page.title,
          fontSize: 12
        }
        contentList.push(text);
        // テーブルヘッダー設定
        let tablebody = [];
        let tableHeaderData = this.headerData(page.isProcessedParts);
        let tableHeader = this.headerList(tableHeaderData);
        tablebody.push(tableHeader);
        // 部品個数をゼロとして定義(カウント用)
        let partsAmount = 0;
        // 部品データ変換
        for(let i=0,item;item=page.parts[i];i++){
          // 部品個数をカウント
          partsAmount += 1;
          let partRow = [];
          // テーブルヘッダーと同じデータを順番に配列に格納
          for(var h=0,head;head=tableHeaderData[h];h++){
            let d = item[head.value];
            // データがネストしている場合はネスト先データを表示
            // if(tableHeaderData[h].nest) {
            //   if(d) {
            //     d = d[tableHeaderData[h].nest];
            //   }
            // }
            // データが右寄せ(数値)の場合は右寄せ処理
            if(tableHeaderData[h].align=="end") {
              d = {"text": d, alignment: "right"}
              // console.log(d);
            }
            // データが未定義の場合はblankを入力
            if(!d) { d = ""; }
            partRow.push(d);
          }
          tablebody.push(partRow);
        }
        // テーブルデータ構成
        let tableData = {
          table: {
            headerRows: 1,
            widths: [130, 70, 150, 80, 40, 50],
            body: tablebody
          }
        }
        // 印刷用データセットにtableを格納
        contentList.push(tableData);
        // 部品データがゼロの場合デキストを挿入
        if(page["parts"].length==0) {
          contentList.push({"text": "No data available", "alignment": "center"});
        } else {
          let itemAmount = "Total " + partsAmount + " items"
          contentList.push({"text": itemAmount, "alignment": "right"});
        }
        // 最終ページ以外で改ページ
        if(p!=val["page"]-1) {
          contentList.push({ text: '', pageBreak: 'after'});
        }
      }

      // 出力データ整形
      let pdfData = {
        "headerText": headerText,
        "content": contentList,
      }
      return pdfData;
    }
  }
}