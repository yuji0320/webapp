export default {
  data() {
    return {
      defaultPageMargins: [20,60,20,50],
      pdfStyles: {
        tableStyle: {
          fontSize: 11,
          margin: [ 0, 0, 0, 0]
        }
      },
    }
  },
  computed: {},
  methods: {
    // printPDFに対して”content”と"header"データを渡す
    printPDF(val) {
      let docDefinition = this.createPDFData(val);
      let pdfname = val.headerText + "_" + new Date();
      // データのオブジェクト化
      let pdfData = {
        "docDefinition": docDefinition,
        "pdfName": pdfname
      }
      // プリントの実行
      this.pdfgennerate(pdfData);
    },
    // PDFデフォルトヘッダー
    defaultHeaderPDF(val) {
      return {
        text: val, 
        margin: [50,20],
        alignment: "center",
        fontSize: 15,
        bold: true
      }; 
    },
    // PDF用データ作成
    createPDFData(val) {
      // ヘッダー用テキストを定義      
      let pdfHeader = this.defaultHeaderPDF(val.headerText);
      if(val.header) { 
        pdfHeader = val.header; 
        // console.log(pdfHeader);
      };
      // ページマージンの定義
      let pageMargins = this.defaultPageMargins
      if(val.pageMargins) {
        pageMargins = val.pageMargin;
      }
      if(val.pageMargins) {
        pageMargins = val.pageMargins;
        // console.log(pageMargins);
      };
      // ページスタイルの定義
      let styles = this.pdfStyles;
      if(val.styles) {
        styles = val.styles;
        // console.log(styles);
      };
      // console.log(val);
      // データ定義
      var docDefinition = { 
        // ヘッダー等
        header(){ return pdfHeader;},
        // データ表示部分
        content: [ val.content ],
        footer: function(currentPage, pageCount) {
          let footerData = {
            margin:[0, 10, 0, 0],
            columns: [
              {
                fontSize: 9,
                text:currentPage.toString() + ' of ' + pageCount,
                alignment: 'center'
              }
            ]
          };
          return footerData
        },
        // 印刷プロパティ
        pageSize: 'LETTER',
        pageMargins: pageMargins,
        defaultStyle: {
          font: 'GenShin',
          fontSize: 8
        },
        styles: styles,
      }  
      return docDefinition;
    },
    // プリント機能関数
    pdfgennerate(val) {
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
