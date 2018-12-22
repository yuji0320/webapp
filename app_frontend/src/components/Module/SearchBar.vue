<template>
  <v-layout row wrap>
    <v-flex sm8 md4 lg3 d-flex>
      <app-pagination
        v-model="search.page"
        :length="length"
        :count="count"
      ></app-pagination>
    </v-flex>

    <v-flex sm4 md2 lg2>
      <v-subheader>
        Total : {{ count }} items
      </v-subheader>
    </v-flex>

    <v-flex sm12 md6 lg7>
      <app-search
        v-model="search.incremental"
      ></app-search>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState } from "vuex";
import Pagination from "@/components/Module/Pagination.vue";
import Search from "@/components/Module/Search.vue";

export default {
  name: "searchBar",
  data() {
    return {
      // 検索関係データバインド
      search: {
        // ページネーション初期値
        page: 1,
        // 絞り込み検索初期値
        incremental: {}
      },
      maxpage: 2
    };
  },
  props: {
    // 親からの引き継ぎデータ
    length: { required: true },
    count: { required: true },
    orderBy: { required: true },
    incremental: { required: true }
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    // データ検索用パラメータを格納
    params() {
      return {
        company: this.loginUserData.companyId,
        order_by: this.orderBy
      };
    }
  },
  watch: {
    // ページネーション部分検索
    "search.page": function(val) {
      this.params.page = val;
      const search = { params: this.params };
      this.$emit("search-list", search);
    },
    // 頭出し検索反映
    "search.incremental.tableSearch": function(val) {
      const keyname = this.search.incremental.tableSelectValue;
      this.params[keyname] = val;
      // 頭出し検索時、強制的にページネーションを1にする
      this.search.page = 1;
      this.params.page = 1;
      const search = { params: this.params };
      this.$emit("search-list", search);
    }
  },
  components: {
    "app-pagination": Pagination,
    "app-search": Search
  },
  created() {
    // ページ生成時に親コンポーネントのバインドデータを取得する
    this.search.incremental = this.incremental;
  }
};
</script>
