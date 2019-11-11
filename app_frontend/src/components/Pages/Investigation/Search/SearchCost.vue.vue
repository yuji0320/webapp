<template>
  <v-container fluid grid-list-lg>

    <!-- 読み込み中ダイアログコンポーネント -->
    <!-- <app-loading-dialog></app-loading-dialog> -->

    <app-card>
      <!-- ヘッダー部分スロット -->
      <span slot="card-header-icon"><v-icon>search</v-icon></span>
      <span slot="card-header-title">Search Parts Costs</span>

      <!-- 戻るボタン -->
      <span slot="card-header-buck-button">
        <v-btn @click="backToMenu">
          <v-icon>reply</v-icon>
          Back to Menu
        </v-btn>
      </span>

      <!-- 検索フォーム -->
      <div slot="search-bar">
        <v-layout row wrap>
          <!-- 検索部分 -->
          <v-flex xs12>
            <v-expansion-panel insert expand v-model="isExpand">
              <v-expansion-panel-content>
                <template v-slot:header>
                  <h4 class="font-weight-light"><v-icon>search</v-icon>Search Form</h4>
                  <span class="text-right">{{ expandMessage }}</span>
                </template>
                <v-card-text>
                  <v-form>
                    <v-layout row wrap>
                      <!-- 工事番号 -->
                      <v-flex xs12 sm6 md4>
                        <app-incremental-model-search
                          label="Job Order"
                          orderBy="-mfg_no"
                          v-model="mfgNoID"
                          searchType="jobOrder"
                          ref="jobOrder"
                          @clear-item="mfgNoID=''"
                        ></app-incremental-model-search>
                      </v-flex>
                      <!-- メーカー -->
                      <v-flex xs12 sm6 md4>
                        <app-incremental-model-search
                          label="Manufacturer"
                          orderBy="name"
                          v-model="manufacturerID"
                          searchType="partner"
                          filter="manufacturer"
                          ref="manufacturer"
                          @clear-item="manufacturerID=''"
                        ></app-incremental-model-search>
                      </v-flex>
                      <!-- 仕入先 -->
                      <v-flex xs12 sm6 md4>
                        <app-incremental-model-search
                          label="Supplier"
                          orderBy="name"
                          v-model="supplierID"
                          searchType="partner"
                          filter="supplier"
                          ref="supplier"
                          @clear-item="supplierID=''"
                        ></app-incremental-model-search>
                      </v-flex>
                      <!-- 型式、図面番号 -->
                      <v-flex xs12 sm6 md4>
                        <v-layout row wrap>
                          <v-flex xs6 sm8 xl9>
                            <v-text-field 
                              label="Standard / Drawing Number"
                              v-model="partsData"
                            ></v-text-field>
                          </v-flex>
                            <v-flex class="pt-3" xs6 sm4 xl3>
                              <v-btn @click="partsData=''">Clear</v-btn>
                            </v-flex>
                        </v-layout>
                      </v-flex>
                      <!-- 検索ボタン -->
                      <v-flex xs12 md8>
                        <v-layout justify-end align-end fill-height>
                          <v-btn 
                            class="primary" 
                            @click="search"
                            :disabled = "mfgNoID === '' && manufacturerID === '' && supplierID === '' && partsData === ''"
                            Elevation="24"
                          >Search</v-btn>
                        </v-layout>
                      </v-flex>
                    </v-layout>
                  </v-form>
                </v-card-text>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-flex>

          <!-- ページネーション -->
          <v-flex xs12 sm8 lg5>
            <app-pagination
              v-model="page"
              :length="receivingProcesses.pages"
              :count="receivingProcesses.count"
            ></app-pagination>
            <v-subheader>
              Total : {{ receivingProcesses.count ? receivingProcesses.count : 0 }} items
            </v-subheader>
          </v-flex>
        </v-layout>
      </div>

      <span slot="card-content">
        <!-- テーブル表示 -->
        <app-data-table
          :headers="headers"
          :items="receivingProcesses.results"
          :editDisabled="true"
          ref="data_table"
        >
        </app-data-table>
      </span>

    </app-card>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  title: "Parts Search",
  name: "PartsSearch",
  data(){
    return {
      isExpand: [true],
      mfgNoID: "",
      manufacturerID:"",
      supplierID: "",
      partsData: "",
      orderBy: 'order__manufacturer__name,order__standard,order__drawing_number,suspense_received_date',
      headers: [
        { text: "MFG No.", value: "orderData", nest:"mfgNo" },
        { text: "Part Name", value: "orderData", nest:"name" },
        { text: "Standard / Drawing No", value:"orderData", nest:"billOfMaterial", nestNest:"partsDetail" },
        { text: "Supplier", value: "orderData" , nest: "supplierData", nestNest:"abbr"},
        { text: "Order Date", value: "orderData", nest: "orderedDate", class: "text-xs-right" },
        { text: "Order Amount", value: "orderData", nest: "amount", class: "text-xs-right" },
        { text: "Order UP", value: "orderData", nest: "displayPrice", class: "text-xs-right" },
        { text: "Received", value: "suspenseReceivedDate" },
      ],
      //  仕入完了時色変更
      completeColumn: "suspenseReceivedDate",
      page: 1
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
        company: this.loginUserData["companyId"],
        order__bill_of_material__job_order: this.mfgNoID,
        order__bill_of_material__manufacturer: this.manufacturerID,
        order__supplier: this.supplierID,
        parts_data: this.partsData,
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
      this.$store.commit("systemConfig/setLoading", false);
    },
    // 検索実行
    search() {
      this.page = 1;
      this.setReceivingProcessesList({});
      this.getList({params: this.params});
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
