<template>
  <div>
    <!-- データ読み込み用HTML部分 -->
    <v-text-field label="Select xlsx file" @click="pickFile" v-model="dataName" prepend-icon="attach_file"></v-text-field>
    <input 
      type="file"
      style="display: none"
      ref="data"
      @change="onFilePicked"
      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    >
    <p>
      Data Name: {{ dataName }}<br>
      Json Data: <br>
      {{ dataJson }}
    </p>

    <!-- データ出力用HTML部分 -->
    <button type="button" v-on:click="onexport">Excel download</button>
  </div>
</template>

<script>
import XLSX from "xlsx";

export default {
  name: "excelUpload",
  data: function(){
    return {
      dataName: "",
      dataSize: "",
      dataJson: {},
      Datas: {
        // We will make a Workbook contains 2 Worksheets
        'animals': [
          {"name": "cat", "category": "animal"},
          {"name": "dog", "category": "animal"},
          {"name": "pig", "category": "animal"}
        ],
        'pokemons': [
          {"name": "pikachu", "category": "pokemon"},
          {"name": "Arbok", "category": "pokemon"},
          {"name": "Eevee", "category": "pokemon"},
        ]
      }
    }
  },
  methods: {
    // エクセル出力
    onexport () { // On Click Excel download button
    
      // export json to Worksheet of Excel
      // only array possible
      var animalWS = XLSX.utils.json_to_sheet(this.Datas.animals) 
      var pokemonWS = XLSX.utils.json_to_sheet(this.Datas.pokemons) 

      // A workbook is the name given to an Excel file
      var wb = XLSX.utils.book_new() // make Workbook of Excel

      // add Worksheet to Workbook
      // Workbook contains one or more worksheets
      XLSX.utils.book_append_sheet(wb, animalWS, 'animals') // sheetAName is name of Worksheet
      XLSX.utils.book_append_sheet(wb, pokemonWS, 'pokemons')   

      // export Excel file
      XLSX.writeFile(wb, 'book.xlsx') // name of the file is 'book.xlsx'
    },
    pickFile () {
        this.$refs.data.click ()
    },
    // エクセル入力
    onFilePicked (e) {
      var files = e.target.files;
      var file = files[0];
      this.dataName = file.name;

      // 読み込みデータを処理関数へ飛ばす
      var reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onloadend = file => this.readFile(file.target.result);
    },
    readFile(data) {
      let workbook;
      let arr = this.fixData(data);

      // ワークブック読み込み
      workbook = XLSX.read(btoa(arr), {
        type: 'base64',
        cellDates: true,
      });

      var output = "";
      output = this.toJson(workbook);

      this.dataJson = output;
    },
    // ファイルの読み込み
    fixData(data) {
      var o = "", l = 0, w = 10240;
      for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w,
        l * w + w)));
      o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
      return o;
    },
    // ワークブックのデータをjsonに変換
    toJson(workbook) {
      var result = {};
      workbook.SheetNames.forEach(function (sheetName) {
        var roa = XLSX.utils.sheet_to_json(
          workbook.Sheets[sheetName],
          {
              raw: true,
          });
        if (roa.length > 0) {
          result[sheetName] = roa;
        }
      });
      return result;
    }
  }

}
</script>

