<template>
  <v-container fluid grid-list-lg>
    <app-card-table
      :headers="headers"
      :items="receivingProcesses.results"
      :completeColumn="completeColumn"
      :editDisabled="true"
      ref="data_table"
    >
      <!-- ヘッダー部分スロット -->
      <span slot="card-header-icon"><v-icon>search</v-icon></span>
      <span slot="card-header-title">Search Parts Costs</span>

      <!-- 戻るボタン -->
      <span slot="card-header-button">
        <v-btn @click="backToMenu">
          <v-icon>reply</v-icon>
          Back to Menu
        </v-btn>
      </span>

      <!-- 検索フォーム -->
      <div slot="search-bar">
        <!-- 検索コンポーネント -->
        <app-search-toolbar
          :length="receivingProcesses.pages"
          :count="receivingProcesses.count"
          :orderBy="orderBy"
          :params="params"
          :refineParams="refineParams"
          @search-list="getList"
          @clear-params="clearParams"
          :refineDetail="false"
          @update-page-value="updatePageValue"
          v-model="pageValue"
        >
          <span slot="search-data-content">
            <v-row no-gutters> 
              <!-- 工事番号 -->
              <v-col cols="12" sm="6" md="4" lg="3">
                <app-incremental-model-search
                  label="Job Order"
                  orderBy="-mfg_no"
                  v-model="refineParams.order__bill_of_material__job_order"
                  searchType="jobOrder"
                  ref="jobOrder"
                ></app-incremental-model-search>
              </v-col>
              <v-col cols="12" sm="6" md="4" lg="3">
                <app-incremental-model-search
                  label="Manufacturer"
                  orderBy="name"
                  v-model="refineParams.order__bill_of_material__manufacturer"
                  searchType="partner"
                  filter="manufacturer"
                  ref="manufacturer"
                ></app-incremental-model-search>
              </v-col>
              <v-col cols="12" sm="6" md="4" lg="3">
                <app-incremental-model-search
                  label="Supplier"
                  orderBy="name"
                  v-model="refineParams.order__supplier"
                  searchType="partner"
                  filter="supplier"
                  ref="supplier"
                ></app-incremental-model-search>
              </v-col>
              <!-- 部品情報検索 -->
              <v-col cols="12" sm="6" md="4" lg="3">
                <v-text-field 
                  label="Standard / Drawing No"
                  v-model="refineParams.parts_data"
                  clearable
                  class="ps-2"
                ></v-text-field>
              </v-col>
            </v-row>
          </span>
        </app-search-toolbar>
      </div>

      <span slot="bottom-contents">
        <br>
        <!-- 検索コンポーネント 上下pagenation利用 -->
        <app-search-toolbar
          :length="receivingProcesses.pages"
          :count="receivingProcesses.count"
          :orderBy="orderBy"
          :params="params"
          :refineParams="refineParams"
          @search-list="getList"
          @clear-params="clearParams"
          :refineDetail="false"
          @update-page-value="updatePageValue"
          v-model="pageValue"
          :hideToolbar="true"
        >
          <span slot="search-data-content">
            <v-row no-gutters> 
              <!-- 工事番号 -->
              <v-col cols="12" sm="6" md="4" lg="3">
                <app-incremental-model-search
                  label="Job Order"
                  orderBy="-mfg_no"
                  v-model="refineParams.order__bill_of_material__job_order"
                  searchType="jobOrder"
                  ref="jobOrder"
                ></app-incremental-model-search>
              </v-col>
              <v-col cols="12" sm="6" md="4" lg="3">
                <app-incremental-model-search
                  label="Manufacturer"
                  orderBy="name"
                  v-model="refineParams.order__bill_of_material__manufacturer"
                  searchType="partner"
                  filter="manufacturer"
                  ref="manufacturer"
                ></app-incremental-model-search>
              </v-col>
              <v-col cols="12" sm="6" md="4" lg="3">
                <app-incremental-model-search
                  label="Supplier"
                  orderBy="name"
                  v-model="refineParams.order__supplier"
                  searchType="partner"
                  filter="supplier"
                  ref="supplier"
                ></app-incremental-model-search>
              </v-col>
              <!-- 部品情報検索 -->
              <v-col cols="12" sm="6" md="4" lg="3">
                <v-text-field 
                  label="Standard / Drawing No"
                  v-model="refineParams.parts_data"
                  clearable
                  class="ps-2"
                ></v-text-field>
              </v-col>
            </v-row>
          </span>
        </app-search-toolbar>
      </span>

    </app-card-table>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
import CardTable from '@/components/Module/Cards/CardTable.vue';
import SearchToolbar from "@/components/Module/Search/SearchToolbar.vue";

export default {
  title: "Parts Search",
  name: "PartsSearch",
  components: {
    "app-card-table": CardTable,
    "app-search-toolbar": SearchToolbar,
  },
  data(){
    return {
      orderBy: 'order__manufacturer__name,order__standard,order__drawing_number,suspense_received_date',
      headers: [
        { text: "MFG No.", value: "mfgNo" },
        { text: "Part Name", value: "partName" },
        { text: "Standard / Drawing No", value:"partDetail"},
        { text: "Mfr. / Material", value: "partDetailOther"},
        { text: "Supplier", value: "supplierAbbr"},
        { text: "Ordered Date", value: "orderedDate", align: "center" },
        { text: "Order Amount", value: "orderAmount", align: "right" },
        { text: "Order UP($)", value: "totalDefaultCurrencyPrice", align: "right" },
        { text: "Received", value: "suspenseReceivedDate", align: "center" },
      ],
      //  仕入完了時色変更
      completeColumn: "suspenseReceivedDate",
      refineParams: {},
      pageValue: 2
    }
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("receivingProcessAPI", ["receivingProcesses", "receivingProcess"]),
    // パネル開閉ステータス
    expandMessage() {
      return this.isExpand[0] ? 'Close' : 'Open';
    },
    // データ検索用共通パラメータを格納
    params() {
      return {
        order__company: this.loginUserData["companyId"],
        order_by: this.orderBy
      };
    },
  },
  watch: {
    // ページネーション部分検索
    "page": function(val) {
      this.params.page = val;
      const search = { params: this.params };
      this.getList(search);
    },
  },
  methods:{
    ...mapActions("receivingProcessAPI", ["getReceivingProcesses", "setReceivingProcessesList", "setReceivingProcess"]),
    // メニューに戻る
    backToMenu() {
      this.$router.push({ name: "SearchMenu" });
    },
    // リスト取得
    async getList(data) {
      this.$store.commit("systemConfig/setLoading", true);
      await this.getReceivingProcesses(data);
      console.log(data);
      this.$store.commit("systemConfig/setLoading", false);
    },
    // 検索フォーム初期化
    clearParams() {
      this.refineParams = {};
      this.$refs.jobOrder.clearItem();
      this.$refs.manufacturer.clearItem();
      this.$refs.supplier.clearItem();
    },
    // 検索実行
    search() {
      this.page = 1;
      this.setReceivingProcessesList({});
      this.getList({params: this.params});
    },
    // ページ同期関数 *上下pagenation利用時のみ
    updatePageValue(val) {
      // console.log("updatepagevalue", val);
      this.pageValue = val;
    }
  },
  created () {
    this.setReceivingProcessesList({});
    this.$store.commit("systemConfig/setLoading", false);
  }
}
</script>

<style>

</style>
