<template>
  <v-container fluid grid-list-lg>
    <!-- 確認ダイアログ -->
    <app-confirm ref="confirm"></app-confirm>
    <!-- カード形式リストコンポーネント -->
    <app-card-table
      :headers="headers"
      :items="locationMasters.results"
      :viewIcon="false"
      @edit-item="editLocationMaster"
      @delete-item="deleteLocationMasterData"
      @double-click="editLocationMaster"
    >
      <!-- ヘッダー部分スロット -->
      <span slot="card-header-icon"><v-icon large left>list</v-icon></span>
      <span slot="card-header-title">Location Master</span>

      <span slot="card-header-button">
        <v-btn @click="backToMenu">
          <v-icon>reply</v-icon>
          Back to Menu
        </v-btn>
        <!-- 部品表登録編集ダイアログコンポーネント -->
        <app-lm-dialog @response-function="responseFunction" ref="lm_dialog"></app-lm-dialog>
      </span>




    </app-card-table>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
import CardTable from '@/components/Module/Cards/CardTable.vue';
import SearchToolbar from "@/components/Module/Search/SearchToolbar.vue";
import LocationMasterDialog from "@/components/Module/Dialogs/InventoryData/LocationMasterDialog.vue";

export default {
  title: "Location Master List",
  name: "LocationMasterList",
  components: {
    "app-card-table": CardTable,
    "app-search-toolbar": SearchToolbar,
    "app-lm-dialog": LocationMasterDialog,
  },
  data() {
    return {
      orderBy: 'number',
      headers: [
        { text: "Location Number", value: "number" },
        { text: "Location Name", value: "name" },
        { text: "Notes", value: "notes" },
        { text: "Action", value: "action", class: "text-center" }
      ],
      // refineParams: {},
    }
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("inventoryDataAPI", ["responseError", "locationMasters"]),
    params() {
      return {
        company: this.loginUserData.companyId,
        is_standard_inventory: true,
        order_by: this.orderBy,
      }
    }
  },
  methods: {
    ...mapActions("systemConfig", ["showSnackbar"]),
    ...mapActions("inventoryDataAPI", [
      "setLocationMasters",
      "setLocationMaster",
      "getLocationMasters",
      "getLocationMaster",
      "deleteLocationMaster",
    ]),
    async getList(data) {
      this.$store.commit("systemConfig/setLoading", true);
      await this.getLocationMasters(data);
      this.$store.commit("systemConfig/setLoading", false);
    },
    // 編集データ設定
    editLocationMaster(val) {
      this.setLocationMaster(val);
      this.$refs.lm_dialog.openDialogLM();
    },
    // 処理結果統合フォーム
    responseFunction(val) {
      // リストをリロード
      this.getLocationMasters({ params: this.params });
      // Snackbar表示
      this.showSnackbar(val.snack);
    },
    // 保管場所マスタ削除
    async deleteLocationMasterData(val) {
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
        res = await this.deleteLocationMaster(val);
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
      this.setLocationMasters("");
      this.getList({params: this.params});
  }
}
</script>