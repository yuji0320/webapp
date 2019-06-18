<template>
  <v-container fluid grid-list-lg>
    <!-- 確認ダイアログ -->
    <app-confirm ref="confirm"></app-confirm>

    <!-- カード形式リストコンポーネント -->
    <app-card-table
      :headers="headerData"
      :items="makingOrders.results"
      :viewIcon="false"
      @edit-item="editMakingOrder"
      @delete-item="deleteMakingOrderData"
    >
      <!-- ヘッダー部分スロット -->
      <span slot="card-header-icon"><v-icon>send</v-icon></span>
      <span slot="card-header-title">Order - {{ expenseCategory.categoryName }} : "{{ jobOrder.mfgNo }} - {{ jobOrder.name }}" </span>

      <!-- 戻るボタン -->
      <span slot="card-header-buck-button">
        <v-btn @click="backToMenu" >
          <v-icon>reply</v-icon>
          Back to Menu
        </v-btn>
      </span>

      <!-- ダイアログ関係スロット -->
      <span slot="card-dialog">
        <!-- 発注ファイルダイアログ -->
        <app-order-dialog @response-function="responseFunction" ref="order_dialog">
          <span slot="edit-bom" d-inline-flex>
            <v-btn color="primary" dark @click="editBillOfMaterial">Edit Bill of Material</v-btn>
          </span>
        </app-order-dialog>
        <!-- 部品票ダイアログ -->
        <app-bom-dialog @response-function="responseFunction" ref="bom_dialog" :hideButtons="true"></app-bom-dialog>
      </span>


      <!-- カード上部検索機能コンポーネント -->
      <div slot="search-bar">
        <v-layout row wrap>
          <app-search-bar
            :length="makingOrders.pages"
            :count="makingOrders.count"
            :orderBy="orderBy"
            :incremental="incremental"
            :params="params"
            @search-list="getList"
          ></app-search-bar>
        </v-layout>
      </div>


    </app-card-table>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  title: "Making Order List",
  name: "MakingOrderList",
  data() {
    return {
      // ダイアログ関係
      dialog: false,
      // 部品表編集ステータス
      editBOM:false,
      // 部品表デフォルト空データ
      bomDefault: {
        name: "",
      },
      // データ関係
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
        { text: "Action", value: "action", class: "text-xs-center" }
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
      // テーブル検索用データ
      incremental: {
        // 検索カラムリスト
        tableSelectItems: [
          { label: "Part Name", value: "name" }
        ],
        // 検索数値の初期値および返り値
        tableSelectValue: "name",
        tableSearch: ""
      }
    }
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemMasterApi", ["unitTypes", "expenseCategories", "expenseCategory"]),
    ...mapState("jobOrderAPI", ["jobOrder"]),
    ...mapState("billOfMaterialAPI", ["billOfMaterials", "billOfMaterial"]),
    ...mapState("makingOrderAPI", [ "jobOrderID", "partsType", "makingOrders", "makingOrder"]),
    params() {
      return {
        company: this.loginUserData.companyId,
        bill_of_material__job_order: this.jobOrderID,
        bill_of_material__type: this.partsType,
        order_by: this.orderBy,
      };
    },
    params_bom() {
      return {
        company: this.loginUserData.companyId,
        job_order: this.jobOrderID,
        type: this.partsType,
        is_printed: true,
        order_by: this.orderBy,
        page_size: 1000
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
    },
  },
  methods: {
    ...mapActions("systemConfig", ["showSnackbar"]),
    ...mapActions("systemMasterApi", ["getUnitTypes", "getExpenseCategories", "getExpenseCategory"]),
    ...mapActions("jobOrderAPI", ["getJobOrder"]),
    ...mapActions("billOfMaterialAPI", ["getBillOfMaterials", "setBillOfMaterial"]),
    ...mapActions("makingOrderAPI", ["getMakingOrders", "setMakingOrder", "setMakingOrders", "postMakingOrder", "deleteMakingOrder"]),
    async getList(data) {
      this.$store.commit("systemConfig/setLoading", true);
      let list = await this.getMakingOrders(data);
      this.$store.commit("systemConfig/setLoading", false);
    },
    // 配列内のデータ存在チェック
    getHashProperties(array, val){
      const list = array.filter(x => x.billOfMaterial.id === val);
        return list
    },
    // 発注ファイルの存在確認
    async checkMakingOrderExist() {
      // 部品表ファイル、発注ファイルを最大値で取得
      var params_order = {};
      Object.assign(params_order , this.params);
      params_order["page_size"] = 1000;
      await this.getBillOfMaterials({params: this.params_bom});
      await this.getMakingOrders({params: params_order});
      const makingOrderList = this.makingOrders.results;
      const billOfMaterialList = this.billOfMaterials.results;
      
      // 部品表を参照している発注ファイルがあるか確認し、なければ作成
      for(let b in billOfMaterialList) {
        // 発注数量が０より大きい場合のみ
        if(billOfMaterialList[b].orderAmount > 0) {
          // 発注ファイルの存在えお確認し、
          let exist = this.getHashProperties(makingOrderList, billOfMaterialList[b].id);
          if(exist.length == 0) {
            // 発注ファイルが存在しない場合は
            // 新規発注ファイルを定義し、
            let newMakingOrder = {};
            // 部品表情報を代入し
            newMakingOrder.company = billOfMaterialList[b].company;
            newMakingOrder.number = null;
            newMakingOrder.billOfMaterialId = billOfMaterialList[b].id;
            newMakingOrder.name = billOfMaterialList[b].name;
            newMakingOrder.manufacturer = billOfMaterialList[b].manufacturer;
            newMakingOrder.standard = billOfMaterialList[b].standard;
            newMakingOrder.unitNumber = billOfMaterialList[b].unitNumber;
            newMakingOrder.drawingNumber = billOfMaterialList[b].drawingNumber;
            newMakingOrder.material = billOfMaterialList[b].material;
            newMakingOrder.surfaceTreatment = billOfMaterialList[b].surfaceTreatment;
            newMakingOrder.amount = billOfMaterialList[b].orderAmount;
            newMakingOrder.unit = billOfMaterialList[b].unit;
            newMakingOrder.currency = billOfMaterialList[b].currency;
            newMakingOrder.rate = billOfMaterialList[b].rate;
            newMakingOrder.unitPrice = billOfMaterialList[b].unitPrice;
            newMakingOrder.rate = billOfMaterialList[b].rate;
            newMakingOrder.desiredDeliveryDate = billOfMaterialList[b].desiredDeliveryDate;
            newMakingOrder.createdBy = billOfMaterialList[b].createdBy;
            newMakingOrder.modifiedBy = billOfMaterialList[b].modifiedBy;
            // 発注ファイルを作成する
            const res = await this.postMakingOrder(newMakingOrder);
            // console.log("create order");
          } else {
            // すでに存在する場合は何もしない
            // console.log(billOfMaterialList[b].id + " is already exists");
          }
        } else {
          // 発注不要な場合は何もしない
          // console.log(billOfMaterialList[b].id + " is already have");
        }
      }
      // forループ終了後、発注ファイルをリロード
      await this.getMakingOrders({params: this.params});
    },
    // 発注ファイル編集
    editMakingOrder(val) {
      this.setMakingOrder(val);
      this.$refs.order_dialog.editMakingOrder();
    },
    // 部品表ファイル編集
    editBillOfMaterial() {
      this.setBillOfMaterial(this.makingOrder.billOfMaterial);
      this.$refs.bom_dialog.editBillOfMaterial();
      // console.log("edit bom!");
    },
    // 処理結果統合フォーム
    responseFunction(val) {
      // リストをリロード
      this.getList({ params: this.params });
      // Snackbar表示
      this.showSnackbar(val.snack);
    },
    // 発注ファイル削除
    async deleteMakingOrderData(val) {
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
        res = await this.deleteMakingOrder(val);
      } else {
        // Noの場合はスナックバーにキャンセルの旨を表示
        res.snack = { snack: "Delete is cancelled" };
      }
      // リストをリロード
      this.getMakingOrders({ params: this.params });
      // Snackbar表示
      this.showSnackbar(res.snack);
    },
    // メニューに戻る
    backToMenu() {
      this.$router.push({ name: "MakingOrderMenu" });
    },
  },
  created() {
    // もし工事番号等がクリアの場合はメニューにリダイレクトする
    if(!this.partsType || !this.jobOrderID) {
      this.$router.push({ name: "MakingOrderMenu" });
    } else {
      this.setMakingOrders({});
      this.getExpenseCategory(this.partsType);
      this.getJobOrder(this.jobOrderID);
    }
  },
  mounted() {
    this.checkMakingOrderExist();
  }
}
</script>

<style>

</style>
