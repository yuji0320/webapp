export default {
  methods: {
    convertSn2Ut(val) {
      const COEFFICIENT = 24 * 60 * 60 * 1000; // 日数とミリ秒を変換する係数
      const DATES_OFFSET = 70 * 365 + 17 + 1 + 1; // 「1900/1/0」～「1970/1/1」 (日数)
      // var MILLIS_DIFFERENCE = 9 * 60 * 60 * 1000; //UTCとJSTの時差 (ミリ秒)
      return (val - DATES_OFFSET) * COEFFICIENT; // シリアル値→UNIX時間(ミリ秒)
    },
  },
};
