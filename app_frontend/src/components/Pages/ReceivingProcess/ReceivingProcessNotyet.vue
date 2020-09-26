<template>
  <v-container fluid grid-list-lg>
    <app-card-table
      :headers="headers"
      :items="receivingProcesses.results"
      :completeColumn="completeColumn"
    >

      <!-- ヘッダー部分スロット -->
      <span slot="card-header-title"> Past due list</span>

      <!-- 戻るボタン -->
      <span slot="card-header-button">
        <v-btn @click="backToMenu" >
          <v-icon>reply</v-icon>
          Back to Menu
        </v-btn>
      </span>

      <!-- カード上部検索機能コンポーネント -->
      <span slot="search-bar">
        <app-search-toolbar
          :length="receivingProcesses.pages"
          :count="receivingProcesses.count"
          :orderBy="orderBy"
          :params="params"
          :refineParams="refineParams"
          @search-list="getList"
          @clear-params="clearParams"
          :refineDetail="false"
        >
          <span slot="search-data-content">
            <v-row no-gutters> 
              <!-- 部品名検索 -->
              <v-col cols="12" sm="6" md="4" lg="3">
                <v-text-field 
                  label="Parts Name"
                  v-model="refineParams.name"
                  clearable
                  class="ps-2"
                ></v-text-field>
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
              <!-- 仕入れ先検索 -->
              <v-col cols="12" sm="6" md="4" lg="3">
                <app-incremental-model-search
                label="Supplier"
                orderBy="name"
                v-model="refineParams.order__supplier"
                searchType="partner"
                filter="supplier"
                :errorMessages="responseError.order__supplier"
                ref="supplier"
                ></app-incremental-model-search>
              </v-col>
              <!-- 仮仕入済み -->
              <v-col cols="12" sm="6" md="4" lg="3">
                <v-checkbox
                  v-model="refineParams.is_suspense_received"
                  :label="`Not suspense received`"
                  class="ps-2"
                ></v-checkbox>
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
  title: "Over date list",
  name: "ReceivedProcessNotyet",
  components: {
    "app-card-table": CardTable,
    "app-search-toolbar": SearchToolbar
  },
  data() {
    return {
      orderBy: "order__desired_delivery_date",
      // テーブルヘッダー
      headers: [
        { text: "No", value: "orderNumber"},
        { text: "MFG No", value: "mfgNo" },
        { text: "Part Name", value: "partName" },
        { text: "Standard / Drawing No", value:"partDetail"},
        { text: "Supplier", value: "supplierAbbr"},
        { text: "Amount", value: "orderAmount"},
        { text: "Unit price", value: "orderPriceDisplay"},
        { text: "Desired Delivery Date", value: "desiredDeliveryDate"},
        // { text: "Ordered date", value: "orderData" , nest: "orderedDate" },
      ],
      //  仮仕入完了時色変更
      completeColumn: "suspenseReceivedDate", 
      refineParams: {}
    }
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("receivingProcessAPI", ["responseError", "receivingProcesses"]),  
    // 今日の日付をISO形式で取得
    todayISO() {
      // 日付取得
      let dt = new Date();
      let year = dt.getFullYear();
      //1月が0、12月が11。そのため+1をする。
      let month = dt.getMonth()+1;
      let date = dt.getDate();
      let today = year + "-" + month + "-" + date;
      return today;
    },
    params() {
      return {
        order__company: this.loginUserData.companyId,
        is_received: false,
        desired_delivery_date_before: this.todayISO,
        order_by: this.orderBy,
      }
    }
  },
  methods: {
    ...mapActions("receivingProcessAPI", ["getReceivingProcesses"]),
    backToMenu() {
      this.$router.push({ name: "ReceivingProcessMenu" });
    },
    // リスト検索
    async getList(data) {
      this.$store.commit("systemConfig/setLoading", true);
      let list = await this.getReceivingProcesses(data);
      this.$store.commit("systemConfig/setLoading", false);
    },    
    clearParams() {
      this.refineParams = {};
      this.$refs.supplier.clearItem();
    }
  },
  created() {
    this.getList({params: this.params});
    // console.log(this.params);
  }

}
</script>

<style>

</style>
