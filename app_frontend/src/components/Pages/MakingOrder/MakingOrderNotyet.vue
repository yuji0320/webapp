<template>
  <v-container fluid grid-list-lg>
    <app-card-table
      :headers="headers"
      :items="makingOrders.results"
      :viewIcon="false"
    >
      <!-- ヘッダー部分スロット -->
      <span slot="card-header-title">Not ordered list</span>
      <!-- 戻るボタン -->
      <span slot="card-header-button">
        <v-btn @click="backToMenu"><v-icon>reply</v-icon>Back to Menu</v-btn>
      </span>

      <!-- 注意書き -->
      <span slot="card-title-text">*These parts are not ordered.</span>

      <!-- カード上部検索機能コンポーネント -->
      <div slot="search-bar">
        <p class="ma-4">*These parts are not ordered.</p>

        <app-search-toolbar
          :length="makingOrders.pages"
          :count="makingOrders.count"
          :orderBy="orderBy"
          :params="params"
          :refineParams="refineParams"
          @search-list="getList"
          @clear-params="clearParams"
          :refineDetail="false"
        >
          <span slot="search-data-content">
            <v-row no-gutters> 
              
             <v-col cols="12" sm="6" md="4" lg="3">
                <v-text-field 
                  label="Parts Name"
                  v-model="refineParams.name"
                  clearable
                  class="ps-2"
                ></v-text-field>
              </v-col>
              <!-- <v-col cols="12" sm="6" md="4" lg="3">
                <app-incremental-model-search
                label="Manufacturaer"
                orderBy="name"
                v-model="refineParams.manufacturer"
                searchType="partner"
                filter="manufacturer"
                :errorMessages="responseError.manufacturer"
                ref="manufacturer"
                ></app-incremental-model-search>
              </v-col> -->
              <v-col cols="12" sm="6" md="4" lg="3">
                <v-text-field 
                  label="Standard/Form"
                  v-model="refineParams.standard"
                  clearable
                  class="ps-2"
                ></v-text-field>
              </v-col>
              <!-- 加工部品の場合 -->
              <v-col cols="12" sm="6" md="4" lg="3">
                <v-text-field 
                  label="Drawing Number"
                  v-model="refineParams.drawing_number"
                  clearable
                  class="ps-2"
                ></v-text-field>
              </v-col>
              <!-- 仕入れ先 -->
              <v-col cols="12" sm="6" md="4" lg="3">
                <app-incremental-model-search
                label="Supplier"
                orderBy="name"
                v-model="refineParams.supplier"
                searchType="partner"
                filter="supplier"
                :errorMessages="responseError.supplier"
                ref="supplier"
                ></app-incremental-model-search>
              </v-col>

            </v-row>
          </span>
        </app-search-toolbar>
      </div>

    </app-card-table>

  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
import CardTable from '@/components/Module/Cards/CardTable.vue';
import SearchToolbar from "@/components/Module/Search/SearchToolbar.vue";

export default {
  title: "Not orderd",
  name: "MakingOrderNotyet",
  data() {
    return {
      orderBy: "-desired_delivery_date",
      // テーブルヘッダーデータ
      headers: [
        { text: "MFG No", value: "mfgNo" },
        { text: "Order No", value: "number" },
        { text: "Part Name", value: "name" },
        { text: "Standard / Dwaring No", value:"partsDetail" },
        { text: "Supplier", value: "supplierAbbr" },
        { text: "Delivery", value: "desiredDeliveryDate" },
      ],
      // テーブル検索用データ
      refineParams:{},
    }
  },
  components: {
    "app-card-table": CardTable,
    "app-search-toolbar": SearchToolbar,
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemMasterApi", ["unitTypes", "expenseCategories", "expenseCategory"]),
    ...mapState("systemUserApi", ["userPartners"]),
    ...mapState("jobOrderAPI", ["jobOrder"]),
    ...mapState("makingOrderAPI", [ "jobOrderID", "partsType", "makingOrders"]),
    params() {
      return {
        company: this.loginUserData["companyId"],
        is_printed: false,
        order_by: this.orderBy,
      };
    },
  },
  methods: {
    ...mapActions("systemMasterApi", ["getUnitTypes", "getExpenseCategories", "getExpenseCategory"]),
    ...mapActions("jobOrderAPI", ["getJobOrder"]),
    ...mapActions("systemUserApi", ["getPartners"]),
    ...mapActions("makingOrderAPI", [ "responseError", "setJobOrderID", "getMakingOrders", "setMakingOrders"]),
    async getList(data) {
      this.$store.commit("systemConfig/setLoading", true);
      await this.getMakingOrders(data);
      this.$store.commit("systemConfig/setLoading", false);
    },
    // 絞り込み検索のクリア
    clearParams() {
      this.refineParams = {};
      // this.$refs.manufacturer.clearItem();
      // this.$refs.supplier.clearItem();
    },
    // メニューに戻る
    backToMenu() {
      this.$router.push({ name: "MakingOrderMenu" });
    },    
  },
  created() {
    this.setMakingOrders({});
    this.getExpenseCategories({params: {"order_by": "category_number"}});
    // this.getJobOrder(this.jobOrderID);
    this.getMakingOrders({params: this.params});
  }

}
</script>

<style>

</style>
