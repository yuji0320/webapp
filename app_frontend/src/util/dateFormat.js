export default {
  computed: {
    todayISO() {
      return new Date().toISOString().substr(0, 10);
    }
  },
  methods: {
    convertSn2Ut(val) {
      const COEFFICIENT = 24 * 60 * 60 * 1000; // 日数とミリ秒を変換する係数
      const DATES_OFFSET = 70 * 365 + 17 + 1 + 1; // 「1900/1/0」～「1970/1/1」 (日数)
      // var MILLIS_DIFFERENCE = 9 * 60 * 60 * 1000; //UTCとJSTの時差 (ミリ秒)
      return (val - DATES_OFFSET) * COEFFICIENT; // シリアル値→UNIX時間(ミリ秒)
    },
    // 日付フォーマットの変換
    changeISODate(val) {
      // console.log(val);
      let isoDate = "";
      if (val !== "NULL") {
        if(val === "0000-00-00") {
          return null;
        }
        // console.log(val);
        let date = val;
        // 日本時間に変換
        date.setHours(date.getHours() + 9);
        // ISO日付に変換
        isoDate = date.toISOString().split('Z')[0] + '+09:00';
        // 時間を切り取り
        isoDate = isoDate.slice(0, 10);
        return isoDate;
      } else {
        return null;
      }
      // console.log(isoDate);
    },    
  },
};
