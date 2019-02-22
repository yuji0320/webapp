<template>
  <v-layout row wrap>
    <!-- {{ model }} -->
    <v-flex xs6>
      <v-autocomplete
        v-model="model"
        :items="searchUserStaffs.results"
        :search-input.sync="search"
        item-text="incrementalField"
        item-value="id"
        cache-items
        :placeholder="label"
        :label="label"
        return-object
        clearable
      ></v-autocomplete>
    </v-flex>

    {{ model }}
  </v-layout>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "SearchStaff",
  data() {
    return {
      descriptionLimit: 60,
      isLoading: false,
      model: null,
      search: null
    }
  },
  props: {
    // 親からの引き継ぎデータ
    label: { required: true },
    orderBy: { required: true },
    // 親のモデル情報を取得する
    value: { required: true }
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemUserApi", ["searchUserStaffs"]),
    // データ検索用パラメータを格納
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
          value: this.model[key] || "n/a"
        }
      })
    },
  },
  methods: {
    ...mapActions("systemUserApi", ["getSearchUserStaffs"]),
    searchData(val) {
      this.params.incremental_field = val;
      let search = { params: this.params }
      this.getSearchUserStaffs(search);
      // this.getFunction(search);
    }
  },
  watch: {
    // 入力値が変化した場合は検索
    search (val) {
      this.searchData(val);
    },
    model (val) {
      this.$emit("change-data", val);
      this.$emit("input", val);
    }
  },
  created() {
    this.searchData("")
    this.model = this.value;
  }
}
</script>
