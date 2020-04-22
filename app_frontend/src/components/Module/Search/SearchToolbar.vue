<template>
  <v-card class="pa-2" flat>
    <v-row no-gutters>
        <v-col cols="12" md="8">
          <app-pagination
            v-model="pageValue"
            :length="length"
            :count="count"
          ></app-pagination>
        </v-col>
        <v-col cols="12" md="4">
            <v-subheader class="d-flex justify-end">
              Total : {{ count }} items
            </v-subheader>
        </v-col>
        <v-col cols="12">
          <!-- 絞り込み検索 -->
          <app-search-data @refine="refine" @clearData="clearData" :refineDetail="refineDetail">
            <span slot="search-data-header-open">
              <slot name="search-data-header-open"></slot>
            </span>
            <span slot="search-data-header-close">
              <slot name="search-data-header-close"></slot>
            </span>
            <span slot="search-data-content">
              <slot name="search-data-content"></slot>
            </span>
            <span slot="search-data-content-sub">
              <slot name="search-data-content-sub"></slot>
            </span>
          </app-search-data>
        </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { mapState } from "vuex";
import Pagination from "@/components/Module/Search/Pagination.vue";
import SearchData from "@/components/Module/Search/SearchData.vue";

export default {
  name: "searchToolar",
  data() {
    return {
      pageValue: 1,
    };
  },
  props: {
    // 親からの引き継ぎデータ
    length: { required: true },
    count: { required: true },
    orderBy: { required: true },
    params: { required: true },
    refineParams: { required: true },
    refineDetail:　{ required: false },
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
  },
  watch: {
    // ページネーション部分検索
    "pageValue": function(val) {
      this.params.page = val;
      const search = { params: Object.assign(this.refineParams, this.params)};
      this.$emit("search-list", search);
      // console.log(val, this.params);
    },
  },
  methods: {
    refine() {
      this.pageValue = 1;
      this.params.page = 1;
      const search = {params: Object.assign(this.refineParams, this.params)};
      this.$emit("search-list", search);
      // console.log(search);
    },
    clearData() {
      this.$emit("clear-params");
      // console.log("test");
      
    }
  },
  components: {
    "app-pagination": Pagination,
    "app-search-data": SearchData
  }
};
</script>
