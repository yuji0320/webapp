export default {
  computed: {
    todayISO() {
      return new Date().toISOString().substr(0, 10);
    }
  },
  methods: {
    // getTotayISO() {
    //   var today = new Date().toISOString().substr(0, 10);
    //   console.log(today);
    // }
  }
}