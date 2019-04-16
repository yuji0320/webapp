<template>
  <v-container 
    fluid
    grid-list-lg
  >
    <v-card>
      <!-- Cardヘッダー -->
      <v-toolbar card>
        <v-toolbar-title class="font-weight-light">
          Not ordered list : "{{ jobOrder.mfgNo }} - {{ jobOrder.name }}"
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn @click="backToMenu" >
          <v-icon>reply</v-icon>
          Back to Menu
        </v-btn>
      </v-toolbar>

      <!-- 注意書き -->
      <v-card-text>
        *These parts are not ordered.<br>
        <!-- {{ makingOrders.results }} -->
      </v-card-text>

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

export default {
  title: "Not orderd",
  name: "MakingOrderNotyet",
  data() {
    return {
      orderBy: "-created_at",
      // テーブルヘッダーデータ
      defaultHeadersTop: [
        { text: "No", value: "number" },
        { text: "Part Name", value: "name" }
      ],
      defaultHeadersEnd: [
        { text: "Supplier", value: "supplierData" , nest: "abbr"},
        { text: "Amount", value: "amount", class: "text-xs-right" },
        { text: "Unit Price", value: "displayPrice", class: "text-xs-right" },
        { text: "Delivery", value: "desiredDeliveryDate" },
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
      ],
    }
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemMasterApi", ["unitTypes", "expenseCategories", "expenseCategory"]),
    ...mapState("systemUserApi", ["userPartners"]),
    ...mapState("jobOrderAPI", ["jobOrder"]),
    ...mapState("makingOrderAPI", [
      "jobOrderID", 
      "partsType", 
      "makingOrders"
    ]),
    params() {
      return {
        company: this.loginUserData.companyId,
        job_order: this.jobOrderID,
        is_printed: false,
        order_by: this.orderBy,
        page_size: 1000
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
    // 部品種別毎の部品表仕分け
    partsData() {
      // PDF作成用のデータを構築
      return function (val) {
        let list = {}
        if(this.makingOrders.results) {
          list = this.makingOrders.results.filter(x => x.billOfMaterial.type === val);
        }
        return list
      }
    },
  },
  methods: {
    ...mapActions("systemMasterApi", ["getUnitTypes", "getExpenseCategories", "getExpenseCategory"]),
    ...mapActions("jobOrderAPI", ["getJobOrder"]),
    ...mapActions("systemUserApi", ["getPartners"]),
    ...mapActions("makingOrderAPI", [ "setJobOrderID", "getMakingOrders",]),
    // メニューに戻る
    backToMenu() {
      this.$router.push({ name: "MakingOrderMenu" });
    },    
  },
  created() {
    // もし工事番号等がクリアの場合はメニューにリダイレクトする
    if(!this.jobOrderID) {
      this.$router.push({ name: "MakingOrderMenu" });
    } else {
      this.getExpenseCategories({params: {"order_by": "category_number"}});
      this.getJobOrder(this.jobOrderID);
      this.getMakingOrders({params: this.params});
    }    
  }

}
</script>

<style>

</style>
