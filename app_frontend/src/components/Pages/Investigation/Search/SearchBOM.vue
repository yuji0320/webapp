<template>
  <v-container fluid grid-list-lg>
    <app-card-table
      :headers="switchParams.headers"
      :items="billOfMaterials.results"
      :editDisabled="true"
      :viewIcon="true"
      @view-item="viewBillOfMaterial"
      @double-click="viewBillOfMaterial"
      ref="data_table"
    >
      <span slot="card-header-icon"><v-icon>search</v-icon></span>
      <span slot="card-header-title">{{ switchParams.title }}</span>
      <span slot="card-header-button">
        <v-btn @click="backToMenu">
          <v-icon>reply</v-icon>
          Back to Menu
        </v-btn>
      </span>

      <span slot="card-dialog">
        <app-bom-dialog ref="bomDialog" :hideButtons="true" :editDisable="true"></app-bom-dialog>
      </span>
      <!-- カード上部検索機能コンポーネント -->
      <div slot="search-bar">
        <v-card-text>* Green is already printed.</v-card-text>

        <app-search-toolbar
          :length="billOfMaterials.pages"
          :count="billOfMaterials.count"
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

export default {
  title: "Search BOM",
  name: "SearchBillOfMaterial",
  components: {
    "app-card-table": CardTable,
    "app-search-toolbar": SearchToolbar,
    "app-bom-dialog": BillOfMaterialDialog
  },
  data () {
    return {
      orderBy: 'manufacturer__name,standard,drawing_number',
      // テーブルヘッダーデータ
      defaultHeadersTop: [
        { text: "Part Name", value: "name" }
      ],
      defaultHeadersEnd: [
        { text: "Amount", value: "amount", class: "text-xs-right", align:"right" },
        { text: "Unit Price", value: "displayPrice", class: "text-xs-right", align:"right" },
        { text: "Delivery", value: "desiredDeliveryDate", align:"right" },
        { text: "Action", value: "action", class: "text-xs-center", align:"center" }
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
      refineParams: {}
    }
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("jobOrderAPI", ["jobOrder"]),
    ...mapState("billOfMaterialAPI", ["responseError","jobOrderID", "isProcessed", "billOfMaterials", "billOfMaterial"]),
    params() {
      return {
        company: this.loginUserData["companyId"],
        job_order: this.jobOrderID,
        type__is_processed_parts: this.isProcessed,
        order_by: this.orderBy
      }
    },
    switchParams() {
      let title = "Search Bill of Material" + " : " + this.jobOrder.mfgNo + " - " + this.jobOrder.name;
      let headers = [];
      if (this.isProcessed) {
        title += "(Processed Parts)";
        headers = this.defaultHeadersTop.concat(this.processedHeaders, this.defaultHeadersEnd);
      } else {
        title += "(Not Processed Parts)";
        headers = this.defaultHeadersTop.concat(this.commercialHeaders, this.defaultHeadersEnd);
      }
      return {
        title: title,
        headers: headers
      }
    }
  },
  methods: {
    ...mapActions("jobOrderAPI", ["getJobOrder"]),
    ...mapActions("billOfMaterialAPI", ["getBillOfMaterials", "setBillOfMaterial","setBillOfMaterials",]),
    async getList(data) {
      this.$store.commit("systemConfig/setLoading", true);
      let list = await this.getBillOfMaterials(data);
      this.$store.commit("systemConfig/setLoading", false);
    },
    // 編集データ設定
    viewBillOfMaterial(val) {
      this.setBillOfMaterial(val);
      this.$refs.bomDialog.openDialogBOM();
    },
    // メニューに戻る
    backToMenu() {
      this.$router.push({ name: "SearchMenu" });
    },
    clearParams() {
      this.refineParams = {};
      this.$refs.manufacturer.clearItem();
    }
  },
  created () {
    this.setBillOfMaterials({});
    this.getList({params: this.params})
    this.getJobOrder(this.jobOrderID);
  }
}
</script>

<style>

</style>
