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
      let headerText = text;
      return "test";
    }
  }
}