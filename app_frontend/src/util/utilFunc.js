export default {
  computed: {

  },
  methods: {
    // ファイル名と日付を結合して返す
    exportFileName(val) {
      let today = new Date();
      let y = today.getFullYear();
      let m = today.getMonth() + 1;
      let d = today.getDate();
      let h = today.getHours();
      let min = today.getMinutes();
      let s = today.getSeconds();
      m = ('0' + m).slice(-2);
      d = ('0' + d).slice(-2);
      let dateNow = y + "" + m + "" + d + "-" + h + "" + min + "" + s;
      return val + "_" + dateNow;
    }
  },
};