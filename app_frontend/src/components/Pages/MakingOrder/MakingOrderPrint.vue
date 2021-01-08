<template>
  <v-container fluid grid-list-lg>

    <!-- 読み込み中ダイアログコンポーネント -->
    <app-loading-dialog></app-loading-dialog>

    <!-- 確認ダイアログ -->
    <app-confirm ref="confirm"></app-confirm>
    <app-card>
      <!-- ヘッダー部分スロット -->
      <span slot="card-header-icon"><v-icon>print</v-icon></span>
      <span slot="card-header-title">{{ switchParams.cardTitle }}</span>

      <!-- ボタン -->
      <span slot="card-header-button">
        <v-btn @click="backToMenu" >
          <v-icon>reply</v-icon>
          Back to Menu
        </v-btn>

        <v-btn 
          @click="print"
          color="primary"
          :disabled="printAble"
          class="ml-2"
        ><v-icon>print</v-icon> Print Data</v-btn>
      </span>

      <!-- 注意書き -->
      <span slot="card-text">*{{ switchParams.cardText }}</span>

      <!-- Cardタイトル -->
      <span slot="card-title-text">
        <h2 class="font-weight-light">{{ userPartner.name }}</h2>
      </span>

      <span slot="card-content">
        <!-- 部品種別毎の未印刷部品リスト -->
        <div
          v-for="(category, key) in partsList"
          :key="key"
        >
          <template v-if="category">
            <!-- 項目名 -->
            <v-card-title>
              <span class="title font-weight-light">{{ category.name }}</span>
            </v-card-title>

            <!-- データテーブル -->
            <v-data-table
              v-model="selectedItems[key].selected"
              :headers="headerData(category.isProcessedParts)"
              :items="category.parts"
              hide-default-footer
              class="elevation-1 mb-4"
              show-select
              item-key="id"
              disable-sort
              :items-per-page="category.parts.length"
              dense
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
                    {{ props.item[header.value] }}
                  </td>
                </tr>
              </template>
            </v-data-table>
          </template>
        </div>
      </span>
    </app-card>

  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
import MakingOrderPrintPdf from "./MakingOrderPrintPdf.js"

export default {
  title: "Print PO",
  name: "MakingOrderPrint",
  mixins: [MakingOrderPrintPdf],
  data() {
    return {
      orderBy: 'is_printed,supplier__name,manufacturer__name,standard,drawing_number',
      defaultHeadersTop: [
        { text: "No.", value: "number", align: "end"},
        { text: "Part Name", value: "name" }
      ],
      defaultHeadersEnd: [
        { text: "Qty", value: "amount", align: "end" },
        { text: "Unit price", value: "displayPrice", align: "end" },
        { text: "Price", value: "displayPriceTotal", align: "end" },
        { text: "Delivery", value: "desiredDeliveryDate", align: "center"  }
      ],
      // 市販部品テーブルヘッダー
      commercialHeaders: [
        { text: "Manufacturer", value: "manufacturerAbbr"},
        { text: "Part Number", value: "standard" },
      ],
      // 加工部品テーブルヘッダー
      processedHeaders: [
        { text: "Drawing Number", value: "drawingNumber" },
        { text: "Surface treatment", value: "surfaceTreatment" },
        { text: "Material", value: "material" }
      ],
      // テーブル機能関係
      selectedItems: [],
      // 部品リスト
      partsArray: [],
    };
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemMasterApi", ["unitTypes", "expenseCategories", "expenseCategory"]),
    ...mapState("systemUserApi", ["userPartner", "userCompany"]),
    ...mapState("jobOrderAPI", ["jobOrder"]),
    ...mapState("makingOrderAPI", ["jobOrderID", "partsType", "supplierID", "makingOrders", "reprint"]),
    hasMFGNo() {
      return this.jobOrderID !== "";
    },
    // 印刷か再印刷で内容が変わる部分を定義
    switchParams() {
      let cardTitle = "Print PO : ";
      let cardText = "You can print unprinted PO.";
      let params = {};
      if(this.reprint) {
        cardTitle = "Rerint PO : ";
        cardText = "You can print all PO that already printed."
      }
      // 工事番号の有無
      if(this.hasMFGNo) {
        cardTitle += " : " + this.jobOrder.mfgNo + " - " + this.jobOrder.name;
        params = {
          company: this.loginUserData["companyId"],
          bill_of_material__job_order: this.jobOrderID,
          is_printed: this.reprint,
          supplier: this.supplierID,
          order_by: this.orderBy, 
          page_size: 1000
        }
      } else {
        // 工事番号なしの場合
        cardTitle += " without MFG No";
        params = {
          company: this.loginUserData["companyId"],
          no_bom: true,
          is_printed: this.reprint,
          supplier: this.supplierID,
          order_by: this.orderBy, 
          page_size: 1000
        }
      }
      return {
        "cardTitle": cardTitle,
        "cardText": cardText,
        "params": params
      }
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
      let disabled = true;
      disabled = selected <= 0;
      return disabled;
    },
    // 部品種別リスト作成
    partsList() {
      if(this.makingOrders.results) {
        let orders = this.makingOrders.results;
        let category = [
          {name: "Processed Parts", isProcessed: true},
          {name: "Other", isProcessed: false}
        ];
        let arrObj = [];
        let list = [];
        // 部品種別ごとに発注ファイルをまとめる
        for(let c in category) {
          // 種別ごとに部品リストを集計
          list = orders.filter(x => x.isProcessed === category[c]["isProcessed"]);
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
      }
    },
    // テーブルヘッダー表示用関数
    headerData() {
      // 部品種別ごとにテーブル表示項目を変更
      return function (val) {
        let header = [];
        if(val===true) {
          header = this.defaultHeadersTop.concat(this.processedHeaders, this.defaultHeadersEnd);
        } else {
          header = this.defaultHeadersTop.concat(this.commercialHeaders, this.defaultHeadersEnd);
        }
        return header;
      }
    },
  },
  methods: {
    ...mapActions("systemMasterApi", ["getUnitTypes", "getExpenseCategories", "getExpenseCategory"]),
    ...mapActions("jobOrderAPI", ["getJobOrder", "setJobOrder"]),
    ...mapActions("systemUserApi", ["getPartner", "getCompany"]),
    ...mapActions("receivingProcessAPI", ["getReceivingProcesses", "postReceivingProcess"]),    
    ...mapActions("makingOrderAPI", ["setJobOrderID", "getMakingOrders", "setMakingOrders", "putMakingOrder"]),
    // メニューに戻る
    backToMenu() {
      this.$router.push({ name: "MakingOrderMenu" });
    },
    makePartsArray() {
      let orders = this.makingOrders.results;
      let category = [
        {name: "Processed Parts", isProcessed: true},
        {name: "Other", isProcessed: false}
      ];
      let arrObj = [];
      let list = [];
      // 部品種別ごとに発注ファイルをまとめる
      for(let c in category) {
        // 種別ごとに部品リストを集計
        list = orders.filter(x => x.isProcessed === category[c]["isProcessed"]);
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
    // データの読み込み
    async loadData() {
      this.$store.commit("systemConfig/setLoading", true);
      if(this.jobOrderID) {
        this.getJobOrder(this.jobOrderID);
      } else {
        this.setJobOrder({});
      }
      this.getPartner(this.supplierID);
      await this.getMakingOrders({params: this.switchParams.params});
      await this.getCompany({ detail: this.loginUserData["companyId"] });
      this.$store.commit("systemConfig/setLoading", false);
    }
  },
  created () {
    this.$store.commit("systemConfig/setLoading", false);
    this.setMakingOrders({});
    this.loadData();
  }
}
</script>

<style>

</style>
