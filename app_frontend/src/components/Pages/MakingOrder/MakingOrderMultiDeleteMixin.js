export default {
  computed: {
    // 一つ以上選択されている場合のみTrueを返す
    selectedDataExists() {
      return (this.$refs.data_table.selected).length > 0;
    }
  },
  methods: {
    async multiDelete() {
      if(this.selectedDataExists) {
        let res = {};
        if (
          await this.$refs.confirm.open(
            "Delete",
            "Are you sure to multiple delete these data?",
            { color: "red" }
          )
        ) { 
          // Yesの場合は削除処理
          for(let o=0,order; order = this.$refs.data_table.selected[o]; o++){
            console.log(order);
            res = await this.deleteMakingOrder(order);
          }
        } else {
          // Noの場合はスナックバーにキャンセルの旨を表示
          res.snack = { snack: "Delete is cancelled" };
        }
        // 統合処理
        this.responseFunction(res);
      } else {
        this.showSnackbar({color:"red", snack:"No data selected."});
      }
    }
  }
}