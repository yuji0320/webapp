<template>
  
</template>

<script>
export default {
  computed: {},
  methods: {
    print(val) {
      let docDefinition = this.createData(val);
      let pdfname = docDefinition.header().text + "_" + new Date();
      // データのオブジェクト化
      let pdfData = {
        "docDefinition": docDefinition,
        "pdfName": pdfname
      }
      // プリントの実行
      this.pdfgen(pdfData);
    },
    // PDFデフォルトヘッダー
    defaultHeader(val) {
      return {
        text: val, 
        margin: [50,20],
        alignment: "center",
        fonsSize: 20
      }; 
    },
    // PDF用データ作成
    createData(val) {
      // ヘッダー用テキストを定義      
      let headerText = val.headerText;
      let pdfHeader = this.defaultHeader(headerText);
      // データ定義
      var docDefinition = { 
        // ヘッダー等
        header(){ return pdfHeader;},
        // データ表示部分
        content: [ val.content ],
        // 印刷プロパティ
        pageSize: 'LETTER',
        pageMargins: [20,60,20,50],
        defaultStyle: {
          font: 'GenShin',
          fontSize: 9
        },
        styles: {
          tableStyle: {
            fontSize: 11,
            margin: [ 0, 0, 0, 0]
          }
        },
      }  
      return docDefinition;
    },
    // プリント機能関数
    pdfgen(val) {
      pdfMake.fonts = {
        // 日本語が使用可能なフォントを設定
        GenShin: {
          normal: "GenShinGothic-Normal-Sub.ttf",
          bold: "GenShinGothic-Normal-Sub.ttf",
          italics: "GenShinGothic-Normal-Sub.ttf",
          bolditalics: "GenShinGothic-Normal-Sub.ttf"
        }
      };
      // PDF発行
      pdfMake.createPdf(val.docDefinition).download(val.pdfName);
    }
  }
}
</script>

<style>

</style>
