<template>
  <!-- <v-layout row wrap>
    <v-flex xs6> -->
      <v-autocomplete
        v-model="model"
        :items="searchItems"
        :search-input.sync="search"
        item-text="incrementalField"
        item-value="id"
        cache-items
        :placeholder="label"
        :label="label"
        clearable
        :error-messages="errorMessages"
      ></v-autocomplete>
    <!-- </v-flex>
  </v-layout> -->
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "IncrementalModelSearch",
  data() {
    return {
      descriptionLimit: 60,
      isLoading: false,
      model: this.value,
      search: null
    }
  },
  props: {
    // 親からの引き継ぎデータ
    label: { required: true },
    orderBy: { required: true },
    // 親のモデル情報を取得する
    value: { required: true },
    // 検索先モデル指定
    searchType: { required: true },
    // エラー情報
    errorMessages: { required: true },
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemMasterApi", ["currencies"]),
    ...mapState("systemUserApi", ["searchUserStaffs", "searchUserPartners"]),
    searchItems() {
      if(this.searchType=="staff") {
        return this.searchUserStaffs.results
      } else if(this.searchType=="currency") {
        return this.currencies.results
      } else if(this.searchType=="partner") {
        return this.searchUserPartners.results
      }
    },
    // データ検索用共通パラメータを格納
    params() {
      return {
        company: this.loginUserData.companyId,
        order_by: this.orderBy
      };
    },
    fields () {
      if (!this.model) return []
      return Object.keys(this.model).map(key => {
        return {
          key,
          value: this.model[key] || ""
        }
      })
    },
  },
  methods: {
    ...mapActions("systemMasterApi", ["getCurrencies"]),
    ...mapActions("systemUserApi", ["getSearchUserStaffs", "getSearchUserPartners"]),
    searchData(val) {
      this.params.incremental_field = val;
      let search = { params: this.params }
      // 親コンポーネントで指定した種別ごとに検索動作を分岐する
      if(this.searchType=="staff") {
        // 退職者は表示しない
        search.params.is_tenure = true;
        this.getSearchUserStaffs(search);
      } else if(this.searchType=="currency") {
        this.getCurrencies();
      } else if(this.searchType=="partner") {
        return this.getSearchUserPartners(search);
      } else {
        console.log("Please set vues action!");
      }
    }
  },
  watch: {
    // 入力値が変化した場合は検索
    search (val) {
      this.searchData(val);
    },
    model (val) {
      // console.log(val);
      if(!val) {
        this.$emit("input", "");
      } else {
        this.$emit("input", val);
      }
    }
  },
  created() {
    this.searchData("")
    // this.model = this.value;
  }
}
</script>
