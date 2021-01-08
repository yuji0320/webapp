<template>
  <v-container 
    fluid
    grid-list-lg
  >
    <app-excel-upload
      :headers="headers"
      @back-to-list="backToList"
      @fix-json="fixJson"
      @submit-data="submitData"
    >
      <!-- ヘッダー部分スロット -->
      <span slot="card-header-icon"><v-icon>work</v-icon></span>
      <span slot="card-header-title">Job Order Excel Upload</span>
    
      <span slot="card-body">
        <!-- {{ userPartners }} -->
      </span>

    </app-excel-upload>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
import moment from "moment";

export default {
  title: "Job Order Upload",
  name: "JobOrderUpload",
  data() {
    return {
      headers: [
        { text: "MFG No.", value: "mfgNo" },
        { text: "Product name", value: "name" },
        { text: "Customer", value: "customerName"},
        {
          text: "Delivery destination",
          value: "deliveryDestinationName",
        },
        { text: "Order Currency", value: "orderCurrencyCode" },
        { text: "Order Rate", value: "orderRate" },
        { text: "Order Price", value: "orderPrice", class: "text-xs-right", money:true },
        { text: "Order Date", value: "orderDate" },
        { text: "Delivery Date", value: "deliveryDate" },
        { text: "Completion Date", value: "completionDate" },
        // { text: "Notes", value: "notes" },
        { text: "Action", value: "action" }
      ],      
    }
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemConfig", ["excelJson"]),
    ...mapState("systemMasterApi", ["currencies"]),
    ...mapState("systemUserApi", ["userPartners"]),
    params() {
      return {
        company: this.loginUserData.companyId,
        order_by: this.orderBy
      };
    },
    currencyList() { return this.currencies.results; },
    partnerList() { return this.userPartners.results; }
  },  
  methods: {
    ...mapActions("systemConfig", ["setExcelJson", "showSnackbar"]),
    ...mapActions("systemMasterApi", ["getCurrencies"]),
    ...mapActions("systemUserApi", ["getPartners"]),
    ...mapActions("jobOrderAPI", ["postJobOrder"]),
    backToList() {
      this.$router.push({ name: "JobOrderList" });
    },
    fixJson(val) {
      // console.log(val);

      for(let i = 0; i < val.length; i++) {
        // オブジェクトのエラーコードを初期値とともに設定
        val[i].err = false;

        // オブジェクトの配列番号をkeyとして設定
        val[i].key = i;

        // ユーザー情報をレコードに挿入
        val[i].company = this.loginUserData.companyId;
        val[i].createdBy = this.loginUserData.id;
        val[i].modifiedBy = this.loginUserData.id;
        
        // 受注通貨情報を登録
        if(val[i].orderCurrencyCode) {
          // システム通貨マスタと通過情報を突合
          for(let c in this.currencyList) {
            if(val[i].orderCurrencyCode==this.currencyList[c].code) {
              val[i].orderCurrency = this.currencyList[c].id;
            }
          }
          // 値が未入力の場合はデフォルト通過を設定する
          if(!val[i].orderCurrency) {
            val[i].orderCurrency = this.loginUserData.defaultCurrencyId;
          }
        }

        // 取引先情報の登録
        if(val[i].customerName) {
          for(let p in this.partnerList) {
            if(val[i].customerName==this.partnerList[p].abbr) {
              val[i].customer = this.partnerList[p].id;
            }
          }
          // 値が未入力の場合は空データを設定する
          if(!val[i].orderCurrency) {
            val[i].customer = "";
          }
        }
        // 納入先情報の入力
        if(val[i].deliveryDestinationName) {
          for(let p in this.partnerList) {
            if(val[i].deliveryDestinationName==this.partnerList[p].abbr) {
              val[i].deliveryDestination = this.partnerList[p].id;
            }
          }
          // 値が未入力の場合は空データを設定する
          if(!val[i].deliveryDestination) {
            val[i].deliveryDestination = "";
          }          
        }

        // 受注日のフォーマット
        if (val[i].orderDate) {
          let newDt = moment(val[i].orderDate,"MM/DD/YY")
          val[i].orderDate = moment(newDt).format('YYYY-MM-DD')
        }

        // 納入日のフォーマット
        if (val[i].deliveryDate) {
          let newDt = moment(val[i].deliveryDate,"MM/DD/YY")
          val[i].deliveryDate = moment(newDt).format('YYYY-MM-DD')
        }

        // 工事完了日のフォーマット
        if (val[i].completionDate) {
          let newDt = moment(val[i].completionDate,"MM/DD/YY")
          val[i].completionDate = moment(newDt).format('YYYY-MM-DD')
        }

      }
      // データをVuexに格納
      this.setExcelJson(val);
    },
    // データ登録処理
    async submitData(val) {
      // console.log(val);
      let res = {};
      res = await this.postJobOrder(val);
      if (res.data) {
        // 成功時
        this.showSnackbar(res.snack);
      } else {
        // 失敗時
        this.showSnackbar(res.snack);
        // this.excelJson[val.key].err = true;
        console.log(res.error);
      }
    }
  },
  mounted() {
    this.setExcelJson([]);
    this.getCurrencies();
    this.getPartners({ params: this.params });
  }
}
</script>

<style>

.datatable thead th.column.sortable, .datatable thead th.column.sortable i {
	color: inherit !important;
}

table.table tbody tr:hover {
	background: rgba(238, 238, 238, 0.2) !important;
}
.datatable__actions {
	color: inherit;
}

.datatable__actions__select .input-group--select .input-group__selections__comma, .datatable__actions__select .input-group--select .input-group__append-icon {
  color: inherit !important;
}
</style>
