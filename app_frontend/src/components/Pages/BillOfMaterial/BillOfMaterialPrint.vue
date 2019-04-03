<template>
  <v-container 
    fluid
    grid-list-lg
  >
    <v-card>
      <!-- Cardヘッダー -->
      <v-toolbar card>
        <v-icon>print</v-icon>
        <v-toolbar-title class="font-weight-light">
          Print Bill of Material : "{{ jobOrder.mfgNo }} - {{ jobOrder.name }}"
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn 
          @click="pdfgen"
          color="primary"
        ><v-icon>print</v-icon> Print Data</v-btn>
      </v-toolbar>

      <!-- {{ headerData("process") }} -->
      <!-- {{ billOfMaterials }} -->
      <!-- {{ partsData("2035b693-1834-4939-a06a-c9558e935ef5") }} -->
      <!-- {{ expenseCategories }} -->


      <!-- 部品種別毎の未印刷部品リスト -->
      <div
        v-for="(category, id) in expenseCategories.results"
        :key="id"
      >
        <!-- 項目名 -->
        <v-card-title>
          <span class="title font-weight-light">{{ category.categoryName }}</span>
        </v-card-title>

        <!-- テーブルデータ -->
        <v-data-table
          :headers="headerData(category.isProcessedParts)"
          :items="partsData(category.id)"
          :hide-actions="true"
          class="elevation-1 mb-4"
          disable-initial-sort
        >
          <template slot="items" slot-scope="props">
            <tr>
              <td 
                v-for="(header, index) in headerData(category.isProcessedParts)"
                :key="index"
                :class="header.class"
              >
                <!-- jsonがネストしている場合はデータを抽出 -->
                <template v-if="header.nest">
                  <!-- ネスト元データが存在する場合のみ表示 -->
                  <template v-if="props.item[header.value]">
                    {{ props.item[header.value][header.nest] }}
                  </template>
                </template>
                <!-- ネストしていない場合はデータを表示 -->
                <template v-else>
                  {{ props.item[header.value] }}
                </template>
              </td>
            </tr>
          </template>
          <!-- テーブルフッター -->
          <template v-slot:footer>
            <td 
              :colspan="headerData(category.isProcessedParts).length"
              class="text-xs-right"
            >
              <!-- 部品数を表示 -->
              Total {{ partsData(category.id).length }} items
            </td>
          </template>
        </v-data-table>
      </div>


      <!-- Cardフッター -->
      <v-footer 
        card
        height="auto"
      >
      </v-footer>

    </v-card>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
// pdfmake作成ライブラリの読み込み
import pdfMake from 'pdfmake/build/pdfmake.min.js'
import pdfFonts from 'pdfmake/build/vfs_fonts.js'
pdfMake.vfs = pdfFonts.pdfMake.vfs

export default {
  title: "Print Bill of Material",
  name: "BillOfMaterialPrint",
  data() {
    return {
      orderBy: "-created_at",
      // テーブルヘッダーデータ
      defaultHeadersTop: [
        { text: "Part Name", value: "name" }
      ],
      defaultHeadersEnd: [
        { text: "Amount", value: "amount", class: "text-xs-right" },
        { text: "Delivery", value: "desiredDeliveryDate" }
      ],
      // 市販部品テーブルヘッダー
      commercialHeaders: [
        { text: "Manufacturer", value: "manufacturerData" , nest: "abbr"},
        { text: "Standard/Form", value: "standard" },
        { text: "Unit number", value: "unit_number" }
      ],
      // 加工部品テーブルヘッダー
      processedHeaders: [
        { text: "Drawing Number", value: "drawingNumber" },
        { text: "Surface treatment", value: "surfaceTreatment" },
        { text: "Material", value: "material" }
      ]
    };
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemMasterApi", ["unitTypes", "expenseCategories", "expenseCategory"]),
    ...mapState("jobOrderAPI", ["jobOrder"]),
    ...mapState("billOfMaterialAPI", [
      "jobOrderID", 
      "partsType", 
      "billOfMaterials"
    ]),
    params() {
      return {
        company: this.loginUserData.companyId,
        job_order: this.jobOrderID,
        is_printed: false,
        order_by: this.orderBy
      };
    },
    headerData() {
      // 部品種別ごとにテーブル表示項目を変更
      return function (val) {
        let header = [];
        if(val==true) {
          header = this.defaultHeadersTop.concat(this.processedHeaders, this.defaultHeadersEnd);
        } else {
          header = this.defaultHeadersTop.concat(this.commercialHeaders, this.defaultHeadersEnd);
        }
        return header;
      }
    },
    // PDF用ヘッダーデータ
    headerList() {
      return function (val) {
        let headerArray = [];
        for(let key in val){
          headerArray.push(val[key].text);
        }
        return headerArray;
      }
    },
    partsData() {
      // PDF作成用のデータを構築
      return function (val) {
        const list = this.billOfMaterials.results.filter(x => x.type === val);
        return list
      }
    }
  },
  methods: {
    ...mapActions("systemMasterApi", ["getUnitTypes", "getExpenseCategories", "getExpenseCategory"]),
    ...mapActions("jobOrderAPI", ["getJobOrder"]),
    ...mapActions("billOfMaterialAPI", [
      "setJobOrderID", 
      "setPartsType", 
      "getBillOfMaterials"
    ]),
    // プリント機能関数
    pdfgen: function () {
      // 汎用変数定義
      let expenseCategoriesList = this.expenseCategories.results;

      // ヘッダー用テキストを定義      
      let headerText = "Bill of Material" +" : " + this.jobOrder.mfgNo + " - " + this.jobOrder.name;
      // 印刷用データ作成
      let contentList = []
      for(let key in expenseCategoriesList) {
        // 部品カテゴリ名設定
        let text = {
          text: expenseCategoriesList[key].categoryName,
          fontSize: 12
        }
        contentList.push(text);
        // テーブルヘッダー設定
        let tablebody = [];
        let tableHeaderData = this.headerData(expenseCategoriesList[key].isProcessedParts);
        let tableHeader = this.headerList(tableHeaderData);
        tablebody.push(tableHeader);
        // 部品データ構築
        let partsList = this.partsData(expenseCategoriesList[key].id);
        for(let part in partsList) {
          let partRow = []
          // テーブルヘッダーと同じデータを順番に配列に格納
          for(let h in tableHeaderData) {
            let d = partsList[part][tableHeaderData[h].value];
            // データがネストしている場合はネスと先データを表示
            if(tableHeaderData[h].nest) {
              if(d) {
                d = d[tableHeaderData[h].nest];
              }
            }
            // データがみ定義の場合はblankを入力
            if(!d) { d = ""; }
            partRow.push(d);
          }
          tablebody.push(partRow);
          // console.log(partRow);
        }
        // console.log(partsList);
        let tableData = {
          table: {
            headerRows: 1,
            widths: [130, 75, 90, 80, 70, 60],
            body: tablebody
          }
        }
        contentList.push(tableData);
        if(partsList.length==0) {
          contentList.push({"text": "No data available"});
          // console.log("test");
        }
        // 最終ページ以外で改ページ
        if(key!=expenseCategoriesList.length-1) {
          contentList.push({ text: '', pageBreak: 'after'});
        }
      }
      // console.log(contentList);
      let pdfName = headerText + "_" + new Date();

      // PDF作成ライブラリの読み込み
      // var pdfMake = require('pdfmake/build/pdfmake.min.js');
      // if (pdfMake.vfs == undefined){
      //   // var pdfFonts = require('pdfmake/build/vfs_fonts.js');
      //   pdfMake.vfs = pdfFonts.pdfMake.vfs;
      // }
      pdfMake.fonts = {
        // 日本語が使用可能なフォントを設定
        GenShin: {
          normal: "GenShinGothic-Bold.ttf",
          bold: "GenShinGothic-Bold.ttf",
          italics: "GenShinGothic-Bold.ttf",
          bolditalics: "GenShinGothic-Bold.ttf"
        },
        // デフォルトのフォント
        Roboto: {
          normal: 'Roboto-Regular.ttf',
          bold: 'Roboto-Medium.ttf',
          italics: 'Roboto-Italic.ttf',
          bolditalics: 'Roboto-MediumItalic.ttf'
        }
      };
      // PDFコンテンツ
      var docDefinition = { 
        // ヘッダー等
        header: function(){
          return {
            text: headerText, 
            margin: [50,20],
            alignment: "center",
            fonsSize: 20
          };
        },
        footer: function(currentPage, pageCount){
          return {
            text: currentPage + "of" + pageCount,
            margin: [20,0],
            alignment: "right"
          };
        },
        // データ表示部分
        content: contentList,
        // 印刷プロパティ
        pageSize: 'LETTER',
        pageMargins: [20,60,20,50],
        defaultStyle: {
          font: 'GenShin'
        }
      }

      // PDF発行
      pdfMake.createPdf(docDefinition).download(pdfName);
    }
  },
  created() {
    // もし工事番号等がクリアの場合はメニューにリダイレクトする
    if(!this.partsType || !this.jobOrderID) {
      this.$router.push({ name: "BillOfMaterialMenu" });
    } else {
      // this.setBillOfMaterials("");
      this.getExpenseCategories({params: {"order_by": "category_number"}});
      this.getJobOrder(this.jobOrderID);
      this.getBillOfMaterials({params: this.params});
    }
  },

}
</script>

<style>

</style>
