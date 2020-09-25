<template>
  <v-container fluid grid-list-lg>
    <app-card-table
      :headers="switchParams.headers"
      :items="makingOrders.results"
      :editDisabled="true"
      :viewIcon="true"
      @view-item="viewMakingOrder"
      @double-click="viewMakingOrder"
      ref="data_table"
    >
      <span slot="card-header-icon"><v-icon>search</v-icon></span>
      <span slot="card-header-title">{{ switchParams.title }}</span>

      <!-- 戻るボタン -->
      <span slot="card-header-button">
        <v-btn @click="backToMenu">
          <v-icon>reply</v-icon>
          Back to Menu
        </v-btn>
      </span>

      <div slot="search-bar">
        <v-card-text>* Green is already Ordered.</v-card-text>
      </div>

      <!-- ダイアログ関係スロット -->
      <span slot="card-dialog">
        <!-- 発注ファイルダイアログ -->
        <app-order-dialog :showAdd="false" ref="orderDialog" :editDisable="true">
          <span d-inline-flex slot="edit-bom">
            <v-btn color="primary" dark @click="viewBillOfMaterial" v-if="hasMFGNo">View Bill of Material</v-btn>
          </span>
        </app-order-dialog>
        <!-- 部品表ダイアログ -->
        <app-bom-dialog ref="bom_dialog" :hideButtons="true" :editDisable="true"></app-bom-dialog>
      </span>

      <!-- カード上部検索機能コンポーネント -->
      <div slot="search-bar">
        <app-search-toolbar
          :length="makingOrders.pages"
          :count="makingOrders.count"
          :orderBy="orderBy"
          :params="switchParams.params"
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
              <v-col cols="12" sm="6" md="4" lg="3" v-show="!isProcessed">
                <app-incremental-model-search
                label="Manufacturaer"
                orderBy="name"
                v-model="refineParams.manufacturer"
                searchType="partner"
                filter="manufacturer"
                :errorMessages="responseError.manufacturer"
                ref="manufacturer"
                ></app-incremental-model-search>
              </v-col>
              <v-col cols="12" sm="6" md="4" lg="3" v-show="!isProcessed">
                <v-text-field 
                  label="Standard/Form"
                  v-model="refineParams.standard"
                  clearable
                  class="ps-2"
                ></v-text-field>
              </v-col>
              <!-- 加工部品の場合 -->
              <v-col cols="12" sm="6" md="4" lg="3" v-show="isProcessed">
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
import BillOfMaterialDialog from '@/components/Module/Dialogs/BillOfMaterialDialog.vue';
import MakingOrderDialog from '@/components/Module/Dialogs/MakingOrderDialog.vue';

export default {
  title: "Search Order",
  name: "SearchOrder",
  components: {
    "app-card-table": CardTable,
    "app-search-toolbar": SearchToolbar,
    "app-bom-dialog": BillOfMaterialDialog,
    "app-order-dialog": MakingOrderDialog,
  },
  data () {
    return {
      orderBy: 'is_printed,supplier__name,manufacturer__name,standard,drawing_number',
      // テーブルヘッダーデータ
      defaultHeadersTop: [
        { text: "No", value: "number" },
        { text: "Part Name", value: "name" }
      ],
      defaultHeadersEnd: [
        { text: "Supplier", value: "supplierAbbr"},
        { text: "Amount", value: "amount", class: "text-xs-right", align:"right" },
        { text: "Unit Price", value: "displayPrice", class: "text-xs-right", align:"right" },
        { text: "Delivery", value: "desiredDeliveryDate" },
        { text: "Ordered Date", value: "orderedDate" },
        { text: "Action", value: "action", class: "text-xs-center" }
      ],
      // 市販部品テーブルヘッダー
      commercialHeaders: [
        { text: "Manufacturer", value: "manufacturerAbbr"},
        { text: "Standard/Form", value: "standard" },
        { text: "Unit number", value: "unit_number" }
      ],
      // 加工部品テーブルヘッダー
      processedHeaders: [
        { text: "Drawing Number", value: "drawingNumber" },
        { text: "Surface treatment", value: "surfaceTreatment" },
        { text: "Material", value: "material" }
      ],
      // テーブル検索用データ
      refineParams: {}
    }
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("jobOrderAPI", ["jobOrder"]),
    ...mapState("billOfMaterialAPI", ["billOfMaterial"]),
    ...mapState("makingOrderAPI", [ "responseError", "jobOrderID", "isProcessed", "makingOrders", "makingOrder"]),
    hasMFGNo() {
      return !!this.jobOrderID;
    },
    // ページごとの設定
    switchParams: function () {
      let title = "Search Order";
      let headers = this.defaultHeadersTop.concat(this.commercialHeaders, this.defaultHeadersEnd);
      // 工事番号有無の確認
      if (this.hasMFGNo) {
        // 線品情報の追加
        title += " : " + this.jobOrder.mfgNo + " - " + this.jobOrder.name;
        // 加工部品かどうか
        if (this.isProcessed) {
          title += " (Processed Parts)";
          headers = this.defaultHeadersTop.concat(this.processedHeaders, this.defaultHeadersEnd);
        } else {
          title += " (Other)"
        }
        return {
          params: {
            company: this.loginUserData["companyId"],
            bill_of_material__job_order: this.jobOrderID,
            bill_of_material__type__is_processed_parts: this.isProcessed,
            order_by: this.orderBy,
          },
          title: title,
          headers: headers
        }
      } else {
        // 工事番号なしの場合
        title += " without MFG No";
        return {
          params: {
            company: this.loginUserData["companyId"],
            no_bom: true,
            order_by: this.orderBy,
          },
          title: title,
          headers: headers
        }
      }
    }
  },
  methods: {
    ...mapActions("jobOrderAPI", ["getJobOrder"]),
    ...mapActions("billOfMaterialAPI", ["setBillOfMaterial", "getBillOfMaterial"]),
    ...mapActions("makingOrderAPI", ["getMakingOrders", "setMakingOrder", "setMakingOrders"]),
    async getList(data) {
      this.$store.commit("systemConfig/setLoading", true);
      await this.getMakingOrders(data);
      console.log(data);
      this.$store.commit("systemConfig/setLoading", false);
    },
    // 発注ファイル編集
    viewMakingOrder: function (val) {
      this.setMakingOrder(val);
      this.$refs.orderDialog.openDialogMO();
    },
    async viewBillOfMaterial() {
      let res = await this.getBillOfMaterial(this.makingOrder.billOfMaterial);
      this.setBillOfMaterial(res);
      this.$refs.bom_dialog.openDialogBOM();
    },
    // メニューに戻る
    backToMenu() {
      this.$router.push({ name: "SearchMenu" });
    },
    clearParams() {
      this.refineParams = {};
    }
  },
  created () {
    this.setMakingOrders({});
    this.getList({params: this.switchParams.params})
    if(this.jobOrderID) {
      this.getJobOrder(this.jobOrderID);
    } 
  }
}
</script>

<style>

</style>
