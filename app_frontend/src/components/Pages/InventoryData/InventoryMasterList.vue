<template>
  <v-container fluid grid-list-lg>
    <!-- 確認ダイアログ -->
    <app-confirm ref="confirm"></app-confirm>

    <!-- カード形式リストコンポーネント -->
    <app-card-table
      :headers="headers"
      :items="inventoryMasters.results"
      :viewIcon="false"
      @edit-item="editInventoryMaster"
      @delete-item="deleteInventoryMasterData"
      @double-click="editInventoryMaster"
    >
      <!-- ヘッダー部分スロット -->
      <span slot="card-header-icon"><v-icon large left>list</v-icon></span>
      <span slot="card-header-title">Inventory Master {{ switchParams.title }}</span>

      <span slot="card-header-button">
        <v-btn @click="backToMenu">
          <v-icon>reply</v-icon>
          Back to Menu
        </v-btn>
        <!-- 部品表登録編集ダイアログコンポーネント -->
        <app-im-dialog @response-function="responseFunction" ref="im_dialog"></app-im-dialog>
      </span>

      <!-- カード上部検索機能コンポーネント -->
      <div slot="search-bar">
        <app-search-toolbar
          :length="inventoryMasters.pages"
          :count="inventoryMasters.count"
          :orderBy="orderBy"
          :params="this.switchParams.params"
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
              <v-col cols="12" sm="6" md="4" lg="3">
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
              <v-col cols="12" sm="6" md="4" lg="3">
                <v-text-field 
                  label="Standard/Form"
                  v-model="refineParams.standard"
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
import InventoryMasterDialog from "@/components/Module/Dialogs/InventoryData/InventoryDataMasterDialog.vue";

export default {
  title: "Inventory Master List",
  name: "InventoryMasterList",
  components: {
    "app-card-table": CardTable,
    "app-search-toolbar": SearchToolbar,
    "app-im-dialog": InventoryMasterDialog,
  },
  data() {
    return {
      orderBy: 'manufacturer__name,standard',
      headers: [
        { text: "Part Name", value: "name" },
        { text: "Manufacturer", value: "manufacturerAbbr"},
        { text: "Standard/Form", value: "standard" },
        { text: "Material", value: "material" },
        { text: "Action", value: "action", class: "text-center" }
      ],
      refineParams: {},
    }
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("inventoryDataAPI", ["responseError", "isStandardInventory", "inventoryMasters"]),
    // ページごとの設定
    switchParams: function () {
      let title = "";
      // 標準在庫かどうかの確認
      if (this.isStandardInventory) {
        // 線品情報の追加
        title = ": Standard Inventory";
        return {
          params: {
            company: this.loginUserData["companyId"],
            is_standard_inventory: true,
            order_by: this.orderBy,
          },
          title: title,
        }

      } else {
        // 工事番号なしの場合
        title = ": In-stock Parts";
        return {
          params: {
            company: this.loginUserData["companyId"],
            is_standard_inventory: false,
            order_by: this.orderBy,
          },
          title: title,
        }
      }
    }

  },
  methods: {
    ...mapActions("systemConfig", ["showSnackbar"]),
    ...mapActions("inventoryDataAPI", [
      "setInventoryMasters",
      "setInventoryMaster",
      "getInventoryMasters",
      "getInventoryMaster",
      "deleteInventoryMaster",
    ]),
    async getList(data) {
      this.$store.commit("systemConfig/setLoading", true);
      await this.getInventoryMasters(data);
      this.$store.commit("systemConfig/setLoading", false);
    },
    // 絞り込み検索のクリア
    clearParams() {
      this.refineParams = {};
      this.$refs.manufacturer.clearItem();
      // console.log("test");
    },
    // 編集データ設定
    editInventoryMaster(val) {
      this.setInventoryMaster(val);
      this.$refs.im_dialog.openDialogIM();
    },
    // 処理結果統合フォーム
    responseFunction(val) {
      // リストをリロード
      this.getInventoryMasters({ params: this.params });
      // Snackbar表示
      this.showSnackbar(val.snack);
    },
    // 部品表削除
    async deleteInventoryMasterData(val) {
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
        res = await this.deleteInventoryMaster(val);
      } else {
        // Noの場合はスナックバーにキャンセルの旨を表示
        res.snack = { snack: "Delete is cancelled" };
      }
      this.responseFunction(res);
    },

    // メニューに戻る
    backToMenu() {
      this.$router.push({ name: "InventoryDataMenu" });
    },
  },
  created() {
      this.setInventoryMasters("");
      this.getList({params: this.switchParams.params});
  }
}
</script>