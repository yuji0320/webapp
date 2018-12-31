<template>
  <v-container 
    fluid
    grid-list-lg
  >
    <!-- 確認ダイアログ -->
    <app-confirm ref="confirm"></app-confirm>

    <!-- カード形式リストコンポーネント -->
    <app-card-table
      :headers="headers"
      :items="userPartners.results"
      @edit-item="test"
      @delete-item="test"
    >

      <!-- ヘッダー部分スロット -->
      <span slot="card-header-icon"><v-icon>people_outline</v-icon></span>
      <span slot="card-header-title">Partner Master</span>


      <!-- カード上部検索機能コンポーネント -->
      <div slot="search-bar">
        <app-search-bar
          :length="userPartners.pages"
          :count="userPartners.count"
          :orderBy="orderBy"
          :incremental="incremental"
          @search-list="getPartners"
        ></app-search-bar>
      </div>

    </app-card-table>

  </v-container>
</template>
  
<script>
import { mapState, mapActions } from "vuex";

export default {
  title: "Partner master",
  name: "Partner",
  data() {
    return {
      orderBy: "-created_at",
      // テーブルヘッダー
      headers: [
        { text: "Parnter number", value: "partnerNumber" },
        { text: "Partner name", value: "name" },
        { text: "Abbreviation", value: "abbr" },
        { text: "is Client", value: "isClient" },
        { text: "is Delivery Destination", value: "isDeliveryDestination" },
        { text: "is Supplier", value: "isSupplier" },
        { text: "is Manufacturer", value: "isManufacturer" },
        { text: "Action", value: "action" }
      ],
      incremental: {
        // 検索カラムリスト
        tableSelectItems: [
          { text: "Partner Number", value: "partnerNumber" },
          { text: "Partner Name", value: "name" },
          { text: "Abbreviation", value: "abbr" }
        ],
        // 検索数値の初期値および返り値
        tableSelectValue: "name",
        tableSearch: ""
      }
    };
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemUserApi", ["userPartners", "userPartner", "responseError"]),
    params() {
      return {
        company: this.loginUserData.companyId,
        order_by: this.orderBy
      };
    }
  },
  methods: {
    ...mapActions("systemConfig", ["showSnackbar"]),
    ...mapActions("systemUserApi", ["getPartners"]),
    test() {}
  },
  created() {
    // ページ作成時にgetでデータを取得
    this.getPartners({
      params: this.params
    });
  }
}
</script>

  