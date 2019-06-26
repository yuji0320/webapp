export default {
  data() {
    return {
      orderBy: "-created_at"
    }
  },
  computed: {
    paramsOrder() {
      return {
        company: this.loginUserData["companyId"],
        bill_of_material__job_order: this.jobOrderID,
        bill_of_material__type__is_processed_parts: this.isProcessed,
        order_by: this.orderBy,
        page_size: 1000
      };
    },
    paramsBom: function () {
      return {
        company: this.loginUserData["companyId"],
        job_order: this.jobOrderID,
        type__is_processed_parts: this.isProcessed,
        is_printed: true,
        order_by: this.orderBy,
        page_size: 1000
      };
    },
  },
  methods: {
    // 配列内のデータ存在チェック
    getHashProperties(array, val){
      return array.filter(x => x.billOfMaterial.id === val)
    },
    async createOrderFile() {
      // ロード開始
      this.$store.commit("systemConfig/setLoading", true);
      // データの取得
      await this.getBillOfMaterials({params: this.paramsBom});
      await this.getMakingOrders({params: this.paramsOrder});
      const makingOrderList = this.makingOrders.results;
      const billOfMaterialList = this.billOfMaterials.results;
      // 部品表を参照している発注ファイルがあるか確認し、なければ作成
      for(let b in billOfMaterialList) {
        // 発注数量が０より大きい場合のみ
        if(billOfMaterialList[b]["orderAmount"] > 0) {
          // 発注ファイルの存在を確認
          let exist = this.getHashProperties(makingOrderList, billOfMaterialList[b].id);
          if(exist.length === 0) {
            // 発注ファイルが存在しない場合は新規発注ファイルを定義し、
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
            let res = await this.postMakingOrder(newMakingOrder);
            console.log(res);
          } else {
            // すでに存在する場合は何もしない
            // console.log(billOfMaterialList[b].id + " is already exists");
          }
        } else {
          // 発注不要な場合は何もしない
          // console.log(billOfMaterialList[b].id + " is already have");
        }
      }
      // Snackbar表示
      this.showSnackbar({color: "success", snack: "Order files are created!"});
      // ロード終了
      this.$store.commit("systemConfig/setLoading", false);
    }
  },
  created() {
    this.$store.commit("systemConfig/setLoading", false);
  }
}
