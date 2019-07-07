<template>
  <v-container fluid grid-list-lg>

    <!-- 読み込み中ダイアログコンポーネント -->
    <app-loading-dialog></app-loading-dialog>

    <v-card>
      <!-- Cardヘッダー -->
      <v-toolbar card>
        <v-icon>search</v-icon>
        <v-toolbar-title class="font-weight-light">
          Search Parts Cost
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn @click="backToMenu">
          <v-icon>reply</v-icon>
          Back to Menu
        </v-btn>

      </v-toolbar>

      <!-- 検索フォーム -->
      <v-card-title>
        <v-layout row wrap>
          <v-flex xs12 sm6 lg4 xl3>
            <app-incremental-model-search
              label="Job Order"
              orderBy="mfg_no"
              v-model="jobOrderId"
              searchType="jobOrder"
              errorMessages=""
            ></app-incremental-model-search>
          </v-flex>
          <!-- メーカー選択 -->
          <v-flex xs12 sm6 lg4 xl3>
            <app-incremental-model-search
              label="Manufacturer"
              orderBy="name"
              v-model="manufacturerId"
              searchType="partner"
              filter="manufacturer"
            ></app-incremental-model-search>
          </v-flex>
          <!-- 型式、図面番号検索用テキスト -->
          <v-flex xs12 sm6 lg4 xl3>
            <v-text-field 
              label="Standard / Drawing number"
              v-model="partsData"
            ></v-text-field>
          </v-flex>
          <!-- 検索ボタン -->
          <v-flex xs12 sm6 lg4 xl3>
            <v-btn color="primary" dark class="mb-2" @click="searchParts()">Search</v-btn>
          </v-flex>
        </v-layout>
      </v-card-title>

      <!-- 部品データ -->
      <div
        v-for="(category, id) in expenseCategories.results"
        :key="id"
      >
        <!-- 項目名 -->
        <v-card-title>
          <span class="title font-weight-light">{{ category.categoryName }}</span>
        </v-card-title>
        <!-- テーブル表示 -->
        <app-data-table
          :headers="headerList(category.isProcessedParts)"
          :items="partsList(category.id)"
          :doNotChangeClass="true"
        ></app-data-table>
        <!-- 位置調整用改行タグ -->
        <br><br><br>
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
  title: "Parts Search",
  name: "PartsSearch",
  data(){
    return {
      orderBy: "created_at",
      jobOrderId: "",
      manufacturerId: "",
      partsData: "",
      // テーブルヘッダーデータ
      defaultHeadersTop: [
        { text: "Part Name", value: "name" },
        { text: "MFG No", value: "mfgNo" }
      ],
      defaultHeadersEnd: [
        { text: "Amount", value: "amount", class: "text-xs-right" },
        { text: "Unit Price", value: "displayPrice", class: "text-xs-right" }
      ],
      // 市販部品テーブルヘッダー
      commercialHeaders: [
        { text: "Manufacturer", value: "manufacturerData" , nest: "abbr"},
        { text: "Standard/Form", value: "standard" },
      ],
      // 加工部品テーブルヘッダー
      processedHeaders: [
        { text: "Drawing Number", value: "drawingNumber" },
        { text: "Surface treatment", value: "surfaceTreatment" },
        { text: "Material", value: "material" }
      ]
    }
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemMasterApi", ["unitTypes", "expenseCategories", "expenseCategory"]),
    ...mapState("billOfMaterialAPI", ["billOfMaterials"]),
    params() {
      return {
        company: this.loginUserData.companyId,
        job_order: this.jobOrderId,
        manufacturer: this.manufacturerId,
        parts_data: this.partsData,
        order_by: this.orderBy,
        page_size: 1000
      };
    },
    headerList() {
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
    partsList() {
      // PDF作成用のデータを構築
      return function (val) {
        let list = [];
        if(this.billOfMaterials) {
          list = this.billOfMaterials.results.filter(x => x.type === val);
        }
        return list
      }
    },
  },
  methods:{
    ...mapActions("systemMasterApi", ["getUnitTypes", "getExpenseCategories", "getExpenseCategory"]),
    ...mapActions("billOfMaterialAPI", ["getBillOfMaterials", "setBillOfMaterials"]),
    async getList(data) {
      this.$store.commit("systemConfig/setLoading", true);
      let list = await this.getBillOfMaterials(data);
      this.$store.commit("systemConfig/setLoading", false);
    },
    searchParts() {
      // console.log(this.params);
      this.getList({params:this.params})
    },
    // メニューに戻る
    backToMenu() {
      this.$router.push({ name: "SearchMenu" });
    }
  },
  created() {
    this.getExpenseCategories({params: {"order_by": "category_number"}});
    this.setBillOfMaterials("");
    this.$store.commit("systemConfig/setLoading", false);
  }
}
</script>

<style>

</style>
