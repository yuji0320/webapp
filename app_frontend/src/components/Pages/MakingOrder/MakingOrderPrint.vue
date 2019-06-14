<template>
  <v-container 
    fluid
    grid-list-lg
  >
    <!-- test -->
    <!-- 確認ダイアログ -->
    <app-confirm ref="confirm"></app-confirm>

    <v-card>
      <!-- Cardヘッダー -->
      <v-toolbar card>
        <v-icon>print</v-icon>
        <v-toolbar-title class="font-weight-light">
          {{ printStatus.cardTitle }}"{{ jobOrder.mfgNo }} - {{ jobOrder.name }}"
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn @click="backToMenu" >
          <v-icon>reply</v-icon>
          Back to Menu
        </v-btn>
        <v-btn 
          @click="print"
          color="primary"
          :disabled="printAble"
        ><v-icon>print</v-icon> Print Data</v-btn>
      </v-toolbar>

      <!-- <img src="../../../assets/ksalogo.png"/> -->
      <!-- {{ printAble }} -->

      <!-- 注意書き -->
      <v-card-text>*{{ printStatus.cardText }}</v-card-text>

      <!-- Cardタイトル -->
      <v-card-title>
        <h2 class="font-weight-light">{{ userPartner.name }}</h2>
      </v-card-title>

      <!-- 部品種別毎の未印刷部品リスト -->
      <div
        v-for="(category, key) in partsList"
        :key="key"
      >
        <template v-if="category">

          <!-- 項目名 -->
          <v-card-title>
            <span class="title font-weight-light">{{ category.categoryName }}</span>
          </v-card-title>

          <v-data-table
            v-model="selectedItems[key].selected"
            :headers="headerData(category.isProcessedParts)"
            :items="category.parts"
            :hide-actions="true"
            class="elevation-1 mb-4"
            select-all=true
            item-key="id"
            disable-initial-sort
          >
            <!-- テーブルデータ -->
            <template slot="items" slot-scope="props">
              <!-- 行クリックで選択 -->
              <tr :active="props.selected" @click="props.selected = !props.selected">
                <td>
                  <v-checkbox
                    :input-value="props.selected"
                    primary
                    hide-details
                  ></v-checkbox>
                </td>              
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
          </v-data-table>

        <!-- {{ selectedItems[key].selected.length }} -->
        </template>
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
import logo from '@/assets/ksalogo.png';
import { userInfo } from 'os';

export default {
  title: "Print PO",
  name: "MakingOrderPrint",
  data() {
    return {
      orderBy: "number",
      // テーブルヘッダーデータ
      defaultHeadersTop: [
        { text: "No.", value: "number", class: "text-xs-right"},
        { text: "Part Name", value: "name" }
      ],
      defaultHeadersEnd: [
        { text: "Qty", value: "amount", class: "text-xs-right" },
        { text: "Unit price", value: "displayPrice", class: "text-xs-right" },
        { text: "Price", value: "displayPriceTotal", class: "text-xs-right" },
        { text: "Delivery", value: "desiredDeliveryDate", class: "text-xs-center"  }
      ],
      // 市販部品テーブルヘッダー
      commercialHeaders: [
        { text: "Manufacturer", value: "manufacturerData" , nest: "abbr"},
        { text: "Part Number", value: "standard" },
        // { text: "Unit number", value: "unit_number" }
      ],
      // 加工部品テーブルヘッダー
      processedHeaders: [
        { text: "Drawing Number", value: "drawingNumber" },
        { text: "Surface treatment", value: "surfaceTreatment" },
        { text: "Material", value: "material" }
      ],
      // テーブル機能関係
      selectedItems: [],
    };
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemMasterApi", ["unitTypes", "expenseCategories", "expenseCategory"]),
    ...mapState("systemUserApi", ["userPartner", "userCompany"]),
    ...mapState("jobOrderAPI", ["jobOrder"]),
    ...mapState("makingOrderAPI", [
      "jobOrderID", 
      "partsType", 
      "supplierID",
      "makingOrders",
      "reprint"
    ]),
    params() {
      return {
        company: this.loginUserData.companyId,
        bill_of_material__job_order: this.jobOrderID,
        is_printed: this.reprint,
        supplier: this.supplierID,
        // no_supplier: this.reprint,
        order_by: this.orderBy,
        page_size: 1000
      };
    },
    paramsPartner() {
      return {
        company: this.loginUserData.companyId,
        order_by: "",
        supplier: this.supplierID,
        page_size: 1000
      }
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
    headerList() {
      return function (val) {
        let headerArray = [];
        var lastkey = Object.keys(val).pop();
        for(let key in val){
          let headerCol = {
            "text": val[key].text,
            "alignment": "center"
          }
          headerArray.push(headerCol);
          // 備考欄の追加
          // lastkey === key ? headerArray.push({
          //   "text": "Note",
          //   "alignment": "center"
          // }) : "";
        }
        return headerArray;
      }
    },
    // 印刷か再印刷で内容が変わる部分を定義
    printStatus() {
      let cardTitle = "Print PO : "
      let cardText = "You can print unprinted PO."

      if(this.reprint) {
        cardTitle = "Rerint PO : "
        cardText = "You can print all PO that already prented."
      }
      
      return {
        "cardTitle": cardTitle,
        "cardText": cardText
      }
    },
    partsList() {
      let orders = this.makingOrders.results;
      let category = this.expenseCategories.results;
      var arrObj = [];
      let list = [];
      // 部品種別ごとに発注ファイルをまとめる
      for(let c in category) {
        // 種別ごとに部品リストを集計
        list = orders.filter(x => x.billOfMaterial.type === category[c]["id"]);
        // 部品個数が０でない場合は配列に挿入
        if(list.length > 0) {
          arrObj[c] = category[c];
          arrObj[c]["parts"] = list;
          // console.log(list);
        }
      }
      // 部品選択用配列に値を代入
      this.selectedItems = arrObj.slice();
      return arrObj;
    },
    // 印刷可否判定
    printAble() {
      let selectedList = this.selectedItems;
      let selected = 0;
      // let disabled = "false";
      // 選択済みの部品数を計算
      for(let s in selectedList) {
        if (selectedList[s].selected) {
          selected += selectedList[s].selected.length;
        }
      }
      let disabled = (selected > 0) ? disabled = false : disabled = true;
      return disabled;
    }
  },
  methods: {
    ...mapActions("systemMasterApi", ["getUnitTypes", "getExpenseCategories", "getExpenseCategory"]),
    ...mapActions("jobOrderAPI", ["getJobOrder"]),
    ...mapActions("systemUserApi", ["getPartner", "getCompany"]),
    ...mapActions("receivingProcessAPI", ["getReceivingProcesses", "postReceivingProcess"]),    
    ...mapActions("makingOrderAPI", [
      "setJobOrderID", 
      "getMakingOrders",
      "setMakingOrders",
      "putMakingOrder"
    ]),
    // メニューに戻る
    backToMenu() {
      this.$router.push({ name: "MakingOrderMenu" });
    },
    // 日付変換
    changeISODateUS (val) {
      let arrDate = val.split("-");
      // console.log(arrDate);
      let usDate = arrDate[1] + "/" + arrDate[2] + "/" + arrDate[0];
      return usDate
    },
    // 印刷機能
    async print() {
      // PDF用データの読み込み
      let val = this.createData();
      // PDF名の定義
      let pdfname = (
        "PO of " + this.jobOrder.mfgNo + " to " + this.userPartner.abbr + 
        "_" + new Date()
      );
      let pdfData = {
        "docDefinition": val.docDefinition,
        "pdfName": pdfname
      }

      // エラー処理
      if(val.error.length > 0) {
        // エラーコードを表示
        if (
          await this.$refs.confirm.open(
            "Error",
            val.error[0],
            { color: "red" }
          )
        ) {}
      } else {
        // エラーがない場合はPDF作成
        this.pdfgen(pdfData);

        // 発注書印刷フラグ立て
        // 際印刷の場合は下記処理を飛ばす
        if(!this.reprint){
          // 日付取得
          let dt = new Date();
          let year = dt.getFullYear();
          //1月が0、12月が11。そのため+1をする。
          let month = dt.getMonth()+1;
          let date = dt.getDate();
          let today = year + "-" + month + "-" + date;

          // 更新用データセットの作成
          let updateData = {
            printedParts: val.printedParts,
            today: today
          }

          let response = await this.createReceiveingProcesses(updateData);

          // 更新処理
          let res = await this.updateIsPrinted(updateData);

          // データの再読込
          this.loadData();
        }
      }

      // console.log(pdfData);
    },
    // PDF用データ作成
    createData() {
      const supplier = this.userPartner;
      const user = this.loginUserData;
      const company = this.userCompany;
      const jobOrder = this.jobOrder;
      let selectedData = this.selectedItems;
      let expenseCategoriesList = this.expenseCategories.results;
      let error = [];

      // 関係会社工事番号のチェックおよび表示
      let mfgNo = jobOrder.mfgNo
      if(supplier.isRelatedParty && jobOrder.relatedPartyMfgNo != "") {
        mfgNo = mfgNo + " / " + jobOrder.relatedPartyMfgNo;
      }

      let today = changeDateUS(new Date());

      // JS日付フォーマット関数(US表記)
      function changeDateUS(dt){
        var y = dt.getFullYear();
        var m = ("00" + (dt.getMonth()+1)).slice(-2);
        var d = ("00" + dt.getDate()).slice(-2);
        var result = m + "/" + d + "/" + y;
        return result;
      };

      // 印刷用部品データ
      let printedParts = [];

      // 印刷用テーブルデータ作成
      let contentList = [];
      // 通貨リスト定義
      let currency = [];
      for(let key in selectedData) {
        if (selectedData[key].selected) {
          if (selectedData[key].selected.length) {
            // テーブルヘッダー設定
            let tablebody = [];
            let tableHeaderData = this.headerData(selectedData[key].isProcessedParts);
            let tableHeader = this.headerList(tableHeaderData);
            // console.log(tableHeader);totalPrice
            tablebody.push(tableHeader);
            // 部品データの入力
            // 部品個数をゼロとして定義(カウント用)
            let partsAmount = 0;
            let orderAmount = 0
            for(let p in selectedData[key].selected) {
              // 印刷部品リストを入力
              printedParts.push(selectedData[key].selected[p]);

              // 部品個数をカウント
              partsAmount += 1;
              // 部品金額を合計
              orderAmount += Math.round(selectedData[key].selected[p].totalPrice * 100)/100;
              orderAmount = Math.round(orderAmount*100)/100;
              // console.log(partsAmount, orderAmount);
              let partRow = [];
              var lastkey = Object.keys(tableHeaderData).pop();
              currency.push(selectedData[key].selected[p].currencyData.display);
              // console.log(selectedData[key].selected[p]);
              for(let h in tableHeaderData) {
                let d = selectedData[key].selected[p][tableHeaderData[h].value];
                // 日付の変換
                if(tableHeaderData[h].value === "desiredDeliveryDate") {
                  if(d) {
                    d = this.changeISODateUS(d);
                  }
                }
                // 発注番号を文字列に変換
                if( h==0 ) d = String(d);
                // データがネストしている場合はネスと先データを表示
                if(tableHeaderData[h].nest) {
                  if(d) {
                    d = d[tableHeaderData[h].nest];
                  }
                }
                // データが右寄せ(数値)の場合は右寄せ処理
                if(tableHeaderData[h].class=="text-xs-right") {
                  d = {"text": d, alignment: "right"}
                  // console.log(d);
                }
                // データが未定義の場合はblankを入力
                if(!d) { d = ""; }
                // 最後の項目では空白を入力
                partRow.push(d);
                // lastkey === h ? partRow.push(""): "";
              }
              tablebody.push(partRow);
              // console.log(partRow);
            }

            // 合計金額計算
            let totalPrice = orderAmount.toFixed(2).toString().replace(/(\d)(?=(\d{3})+($|\.\d+))/g , '$1,');
            let total_display = "";

            // 複数種別の通貨があった場合はエラーフラグを立てる
            var currencyDuplication = currency.filter(function (x, i, self) {
              return self.indexOf(x) === i;
            });
            // 複数通貨の存在チェック
            if(currencyDuplication.length > 1) {
              // 複数の通貨がある場合はエラーフラグを立てる
              let errorMsg = "Multiple currencies are checked. Please select only one currency";
              error.push(errorMsg);
            } else {
              // 単一通貨の場合は場合は合計金額に通貨記号を追加
              total_display = currencyDuplication[0] + " " + totalPrice;
            }

            // 部品種別ごとのテーブル幅定義
            let tableWidths = [];
            let colSpan = 0;
            let totalRow = [];
            if(selectedData[key].isProcessedParts) {
              tableWidths = [10 ,60, 60, 110, 40, 30, 60, 60, 40]
              colSpan = 7
              // 合計金額行を追加
              totalRow = [
                { colSpan: colSpan, text:"Total : ", alignment:"right" },'','','','','','',
                { colSpan: 2, text: total_display , alignment:"right", bold:true }, ''
              ]                  
            } else {
              tableWidths = [10 ,90, 60, 130, 30, 60, 60, 40]
              colSpan = 6
              // 合計金額行を追加
              totalRow = [
                { colSpan: colSpan, text:"Total : ", alignment:"right" },'','','','','',
                { colSpan: 2, text: total_display , alignment:"right", bold:true }, ''
              ]
            }

            tablebody.push(totalRow);

            // テーブル作成
            let tableData = {
              table: {
                headerRows: 1,
                widths: tableWidths,
                body: tablebody
              }
            }
            contentList.push(tableData);
            // 合計個数の表示
            let itemAmount = "Total " + partsAmount + " items"
            contentList.push({"text": itemAmount, "alignment": "right"});

            // POフッター部分
            let poFooter = [
              {
                dontBreakRows: true,
                margin: [ 0, 30, 0, 0 ],
                table: {
                  headerRows: 0,
                  widths: [ 250 ],
                  margin: [ 0, 50, 0, 0 ],
                  body: [
                    [{text: "Created by : " + user.fullname , bold: true, fontSize: 12 }],
                    [{text: "Approved by :", bold: true, fontSize: 12 }],
                    [{text: "Signature :", bold: true, fontSize: 12 }],
                  ]
                },
                layout: {
                  hLineWidth: function (i, node) {
                    return (i === node.table.headerRows) ? 0 : 1;
                  },
                  vLineWidth: function (i) {
                    return 0;
                  },
                },
              },
              {
                margin: [ 0, 20, 0, 0 ],
                table: {
                  headerRows: 0,
                  widths: [ 300 ],
                  body: [
                    [{text: "Note: " }],
                    [{text: "  " }],
                    [{text: "  " }],
                  ]
                },
                layout: {
                  hLineWidth: function (i, node) {
                    return (i === 0 || i === node.table.body.length) ? 1 : 0;
                  },
                  vLineWidth: function (i, node) {
                    return (i === 0 || i === node.table.widths.length) ? 1 : 0;
                  },
                }
              },        
            ]
            // フッターの挿入
            contentList.push(poFooter);
            // console.log("test");

            let nextKey = Number(key) + 1;
            // 最終ページ以外で改ページ
            if(selectedData[nextKey]) {
              if(selectedData[nextKey].selected) {
                // console.log(selectedData[nextKey].selected);
                if (selectedData[nextKey].selected.length) {
                  contentList.push({ text: '', pageBreak: 'after'});
                }
              }
            }

          }
        }
      }

      // PDF作成表データ定義
      let docDefinition = {
        // ヘッダー
        header: function(){
          return [
            {
              columns: [
                { image: company.logoData, width: 100, margin: [ 0, 0, 0, 0 ] },
                [
                  {text: company.name, style: 'title', width: '*', margin: [ 20, 0, 0, 0 ]},
                  {text: company.address, style: 'titleSub', width: '*', margin: [ 20, 0, 0, 0 ]},
                  {text: 'TEL : ' + company.phone + ' FAX : ' + company.fax , style: 'titleSub', width: '*', margin: [ 20, 0, 0, 0 ]},
                ],
              ],
              margin: [ 30, 40, 30, 0 ],
            },
            {
              columns: [
                { text: "Purchase Order", style: 'poTitle', alignment: "center", margin: [ 0, 20, 0, 20 ], decoration: 'underline' }
              ],
              margin: [ 30, 0, 30, 0 ],
            },
            {
              columns: [
                {
                  table: {
                    headerRows: 0,
                    widths: [ 120, 150 ],
                    margin: [ 0, 20, 0, 0 ],
                    body: [
                      [ {text:"Order recipient:", style: 'mdText' }, {text:supplier.name, style: 'mdText' }],
                      [ {text:"Phone : ", style: 'mdText' }, {text:supplier.phone, style: 'mdText' } ],
                      [ {text:"Fax : ", style: 'mdText' }, {text:supplier.fax, style: 'mdText' } ],
                      [ {text:"Manufacturing number : ", style: 'mdText' }, {text:mfgNo, style: 'mdText' } ],
                    ]
                  },
                  layout: {
                    hLineWidth: function (i, node) {
                      return (i === node.table.headerRows) ? 0 : 0.5;
                    },
                    vLineWidth: function (i) {
                      return 0;
                    },
                  },
                },
                [
                  {
                    columns: [
                      {
                        text:'',
                        width: '*'
                      },
                      {
                        table: {
                          body: [
                            [{text:'Date : ' + today, style: 'mdText' } ],
                            [{text: company.name, style: 'mdText' } ],
                            [{text:'Phone : ' + company.phone, style: 'mdText' } ],
                            [{text:'Fax : ' + company.fax, style: 'mdText' } ],
                          ]
                        },
                        margin: [ 0, 0, 40, 0 ],
                        width: 'auto', // Changes width of the table
                        layout: 'noBorders'
                      }
                    ]
                  }
                ]
              ],
              margin: [ 30, 0, 30, 0 ],
            },
          ]
        },
        styles: {
          title: {
            fontSize: 20
          },
          titleSub: {
            fontSize: 13
          },
          poTitle: {
            fontSize: 15,
            bold: true
          },
          mdText: {
            fontSize: 9,
          },
          titleDate: {
            fontSize: 14,
            alignment: 'right',
            bold: true
          },
        },
        // データ表示部分
        content: [ contentList],
        // 印刷プロパティ
        pageSize: 'LETTER',
        pageMargins: [30,300,30,0],
        defaultStyle: {
          font: 'GenShin',
          fontSize: 7
        }
      };

      // データを返す
      let val = {
        docDefinition: docDefinition,
        error: error,
        printedParts: printedParts
      }

      return val;
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
    },
    // 印刷済みステータスの反映
    async updateIsPrinted(val) {
      let partsList = val.printedParts;

      // 編集ステータスの変更
      for(let p in partsList) {
        partsList[p].isPrinted = true;
        partsList[p].orderedDate = val.today;
        partsList[p].modifiedBy = this.loginUserData.id;
        partsList[p].billOfMaterialId = partsList[p].billOfMaterial.id;

        let update = await this.putMakingOrder(partsList[p]);
      }
    },
    // 仕入れファイルの作成
    async createReceiveingProcesses(val) {
      let partsList = val.printedParts;

      // 仕入れファイルの作成
      for(let p in partsList) {
        let receivingProcess = {}
        receivingProcess.order = partsList[p].id;
        receivingProcess.unit = partsList[p].unit;
        receivingProcess.currency = partsList[p].currency;
        receivingProcess.rate = partsList[p].rate;
        receivingProcess.createdBy = this.loginUserData.id;
        receivingProcess.modifiedBy = this.loginUserData.id;

        let res = await this.postReceivingProcess(receivingProcess);

        console.log(res);
      }
    },
    // データの読み込み
    loadData() {
      this.getPartner(this.supplierID);
      this.getExpenseCategories({params: {"order_by": "category_number"}});
      this.getJobOrder(this.jobOrderID);
      this.getMakingOrders({params: this.params});
      this.getCompany({ detail: this.loginUserData.companyId });
    },
    // 印刷済みを戻す
    async dataRivice() {

      let params = {
        company: this.loginUserData.companyId,
        job_order: this.jobOrderID,
        is_printed: true,
        supplier: this.supplierID,
        order_by: this.orderBy,
        page_size: 1000
      };
      this.getMakingOrders({params: params});

      let partsList = this.makingOrders.results;

      // 編集ステータスの変更
      for(let p in partsList) {
        partsList[p].isPrinted = false;
        partsList[p].orderedDate = null;
        partsList[p].modifiedBy = this.loginUserData.id;
        partsList[p].billOfMaterialId = partsList[p].billOfMaterial.id;

        let update = await this.putMakingOrder(partsList[p]);
        console.log(update);
      }      
    }
  },
  created() {
    // もし工事番号等がクリアの場合はメニューにリダイレクトする
    if(!this.jobOrderID || !this.supplierID) {
      this.$router.push({ name: "MakingOrderMenu" });
    } else {
      // APIを叩いてデータを取得
      this.loadData();
      // this.dataRivice();
    }
  }
}
</script>

<style>

</style>
