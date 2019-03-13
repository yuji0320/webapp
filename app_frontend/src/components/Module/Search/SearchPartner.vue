<template>
  <v-layout row wrap>
    <v-flex xs6>
      <v-autocomplete
        v-model="model"
        :items="items"
        :search-input.sync="search"
        item-text="incrementalField"
        item-value="id"
        :placeholder="label"
        :label="label"
        clearable
        :error-messages="errorMessages"
      ></v-autocomplete>
      {{ items }}
    </v-flex>
  </v-layout>
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
      search: null,
      items: []
    };
  },
  props: {
    // 親からの引き継ぎデータ
    label: { required: true },
    orderBy: { required: true },
    // 親のモデル情報を取得する
    value: { required: true },
    // 検索先モデル指定
    searchType: { required: true },
    // 検索先フィルター
    filter: { required: false },
    // エラー情報
    errorMessages: { required: true }
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemUserApi", ["searchUserPartners"]),
    // データ検索用共通パラメータを格納
    params() {
      return {
        company: this.loginUserData.companyId,
        order_by: this.orderBy
      };
    },
    fields() {
      if (!this.model) return [];
      return Object.keys(this.model).map(key => {
        return {
          key,
          value: this.model[key] || ""
        };
      });
    }
  },
  methods: {
    ...mapActions("systemUserApi", [
      "getSearchUserPartners",
      "setSearchUserPartners"
    ]),
    searchData(val) {
      this.items = []
      this.params.incremental_field = val;
      let search = { params: this.params };
      search.params[this.filter] = "true";
      this.getSearchUserPartners(search);
      this.items = this.searchUserPartners.results; 
    }
  },
  watch: {
    // 入力値が変化した場合は検索
    search(val) {
      this.searchData(val);
    },
    model(val) {
      // console.log(val);
      if (!val) {
        this.$emit("input", "");
      } else {
        this.$emit("input", val);
      }
    }
  },
  created() {
    // this.searchData("");
    // this.model = this.value;
  }
};
</script>
