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
    createOrderFile: async function () {
      // ロード開始
      this.$store.commit("systemConfig/setLoading", true);
      // データの取得
      await this.getBillOfMaterials({params: this.paramsBom});
      await this.getMakingOrders({params: this.paramsOrder});
      const makingOrderList = this.makingOrders.results;
      const billOfMaterialList = this.billOfMaterials.results;
      // 部品表を参照している発注ファイルがあるか確認し、なければ作成
      for (let bom in billOfMaterialList) {
        // 発注数量が０より大きい場合のみ
        if (billOfMaterialList[bom]["orderAmount"] > 0) {
          // 発注ファイルの存在を確認
          let exist = this.getHashProperties(makingOrderList, billOfMaterialList[bom].id);
          if (exist.length === 0) {
            // 発注ファイルが存在しない場合は新規発注ファイルを定義し、
            let newMakingOrder = {};
            // 部品表情報を代入し
            newMakingOrder.company = billOfMaterialList[bom].company;
            newMakingOrder.number = null;
            newMakingOrder.billOfMaterialId = billOfMaterialList[bom].id;
            newMakingOrder.name = billOfMaterialList[bom].name;
            newMakingOrder.manufacturer = billOfMaterialList[bom].manufacturer;
            newMakingOrder.standard = billOfMaterialList[bom].standard;
            newMakingOrder.unitNumber = billOfMaterialList[bom].unitNumber;
            newMakingOrder.drawingNumber = billOfMaterialList[bom].drawingNumber;
            newMakingOrder.material = billOfMaterialList[bom].material;
            newMakingOrder.surfaceTreatment = billOfMaterialList[bom].surfaceTreatment;
            newMakingOrder.amount = billOfMaterialList[bom]["orderAmount"];
            newMakingOrder.unit = billOfMaterialList[bom].unit;
            newMakingOrder.currency = billOfMaterialList[bom].currency;
            newMakingOrder.rate = billOfMaterialList[bom].rate;
            newMakingOrder.unitPrice = billOfMaterialList[bom].unitPrice;
            newMakingOrder.rate = billOfMaterialList[bom].rate;
            newMakingOrder.desiredDeliveryDate = billOfMaterialList[bom].desiredDeliveryDate;
            newMakingOrder.createdBy = billOfMaterialList[bom].createdBy;
            newMakingOrder.modifiedBy = billOfMaterialList[bom].modifiedBy;
            // 発注ファイルを作成する
            let res = await this.postMakingOrder(newMakingOrder);
            // console.log(res);
          } else {
            // すでに存在する場合は何もしない
            // console.log(billOfMaterialList[bom].id + " is already exists");
          }
        } else {
          // 発注不要な場合は何もしない
          // console.log(billOfMaterialList[bom].id + " is already have");
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
