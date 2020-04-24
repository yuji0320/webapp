<template>
  <v-container fluid grid-list-lg>
    <!-- 確認ダイアログ -->
    <app-confirm ref="confirm"></app-confirm>

    <!-- カード形式リストコンポーネント -->
    <app-card-table
      :headers="headerData"
      :items="billOfMaterials.results"
      :viewIcon="false"
      @edit-item="editBillOfMaterial"
      @delete-item="deleteBillOfMaterialData"
      @double-click="editBillOfMaterial"
    >
      <!-- ヘッダー部分スロット -->
      <span slot="card-header-icon"><v-icon large left>list</v-icon></span>
      <span slot="card-header-title">BOM - {{ expenseCategory.categoryName }} : "{{ jobOrder.mfgNo }} - {{ jobOrder.name }}" </span>

      <span slot="card-header-button">
        <v-btn @click="backToMenu">
          <v-icon>reply</v-icon>
          Back to Menu
        </v-btn>
        <!-- 部品表登録編集ダイアログコンポーネント -->
        <app-bom-dialog @response-function="responseFunction" ref="bom_dialog"></app-bom-dialog>

        <!-- エクセルアップロード -->
        <v-btn fab small @click="upload" class="ml-2">
          <v-icon>cloud_upload</v-icon>
        </v-btn>
      </span>

      <!-- カード上部検索機能コンポーネント -->
      <div slot="search-bar">
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
              <v-col cols="12" sm="6" md="4" lg="3" v-show="!expenseCategory.isProcessedParts">
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
              <v-col cols="12" sm="6" md="4" lg="3" v-show="!expenseCategory.isProcessedParts">
                <v-text-field 
                  label="Standard/Form"
                  v-model="refineParams.standard"
                  clearable
                  class="ps-2"
                ></v-text-field>
              </v-col>
              <!-- 加工部品の場合 -->
              <v-col cols="12" sm="6" md="4" lg="3" v-show="expenseCategory.isProcessedParts">
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
  title: "Bill of Material List",
  name: "BillOfMaterialList",
  components: {
    "app-card-table": CardTable,
    "app-search-toolbar": SearchToolbar,
    "app-bom-dialog": BillOfMaterialDialog
  },
  data() {
    return {
      orderBy: 'manufacturer__name,standard,drawing_number',
      // テーブルヘッダーデータ
      defaultHeadersTop: [
        { text: "Part Name", value: "name" }
      ],
      defaultHeadersEnd: [
        { text: "Amount", value: "amount", class: "text-right" },
        { text: "Unit Price", value: "displayPrice", class: "text-right" },
        { text: "Delivery(Preferred)", value: "desiredDeliveryDate", class: "text-center" },
        { text: "Action", value: "action", class: "text-center" }
      ],
      // 市販部品テーブルヘッダー
      commercialHeaders: [
        { text: "Manufacturer", value: "manufacturerAbbr"},
        { text: "Standard/Form", value: "standard" },
        { text: "Unit number", value: "unitNumber" }
      ],
      // 加工部品テーブルヘッダー
      processedHeaders: [
        { text: "Drawing Number", value: "drawingNumber" },
        { text: "Surface treatment", value: "surfaceTreatment" },
        { text: "Material", value: "material" }
      ],
      refineParams: {}
    };
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemMasterApi", ["unitTypes", "expenseCategories", "expenseCategory"]),
    ...mapState("jobOrderAPI", ["jobOrder"]),
    ...mapState("billOfMaterialAPI", ["responseError", "jobOrderID", "partsType", "billOfMaterials", "billOfMaterial"]),
    params() {
      return {
        company: this.loginUserData.companyId,
        job_order: this.jobOrderID,
        type: this.partsType,
        order_by: this.orderBy
      };
    },
    headerData() {
      // 部品種別ごとにテーブル表示項目を変更
      let header = [];
      if(this.expenseCategory.isProcessedParts) {
        header = this.defaultHeadersTop.concat(this.processedHeaders, this.defaultHeadersEnd);
      } else {
        header = this.defaultHeadersTop.concat(this.commercialHeaders, this.defaultHeadersEnd);
      }
      return header;
    }
  },
  methods: {
    ...mapActions("systemConfig", ["showSnackbar"]),
    ...mapActions("systemMasterApi", ["getUnitTypes", "getExpenseCategories", "getExpenseCategory"]),
    ...mapActions("jobOrderAPI", ["getJobOrder"]),
    ...mapActions("billOfMaterialAPI", [
      "setJobOrderID", 
      "setPartsType", 
      "getBillOfMaterials",
      "setBillOfMaterial",
      "clearBillOfMaterialError",
      "setBillOfMaterials",
      "postBillOfMaterial",
      "putBillOfMaterial",
      "deleteBillOfMaterial"
    ]),
    async getList(data) {
      this.$store.commit("systemConfig/setLoading", true);
      await this.getBillOfMaterials(data);
      this.$store.commit("systemConfig/setLoading", false);
    },
    clearParams() {
      this.refineParams = {};
      console.log("test");
    },
    // 編集データ設定
    editBillOfMaterial(val) {
      this.setBillOfMaterial(val);
      this.$refs.bom_dialog.openDialogBOM();
    },
    // 処理結果統合フォーム
    responseFunction(val) {
      // リストをリロード
      this.getBillOfMaterials({ params: this.params });
      // Snackbar表示
      this.showSnackbar(val.snack);
    },
    // 部品表削除
    async deleteBillOfMaterialData(val) {
      let res = {};
      // 削除確認
      if (
        await this.$refs.confirm.open(
          "Delete",
          "Are you sure delete this data?",
          { color: "red" }
        )
      ) {
        // Yesの場合は削除処理
        res = await this.deleteBillOfMaterial(val);
      } else {
        // Noの場合はスナックバーにキャンセルの旨を表示
        res.snack = { snack: "Delete is cancelled" };
      }
      this.responseFunction(res);
    },
    // エクセルアップロード
    upload() {
      this.$router.push({ name: "BillOfMaterialUpload" });
    },
    // メニューに戻る
    backToMenu() {
      this.$router.push({ name: "BillOfMaterialMenu" });
    },
  },
  created() {
    // もし工事番号等がクリアの場合はメニューにリダイレクトする
    if(!this.partsType || !this.jobOrderID) {
      this.$router.push({ name: "BillOfMaterialMenu" });
    } else {
      this.setBillOfMaterials("");
      this.getExpenseCategory(this.partsType);
      this.getJobOrder(this.jobOrderID);
      this.getList({params: this.params});
    }
  }
}
</script>

