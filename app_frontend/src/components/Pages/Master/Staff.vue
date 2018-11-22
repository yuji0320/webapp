<template>
  <v-container 
      fluid
      grid-list-lg
    >

    <v-card>
      <v-toolbar card>
          <v-icon>people</v-icon>
          <v-toolbar-title class="font-weight-light">Staff Master</v-toolbar-title>
          <v-spacer></v-spacer>
          <!-- ページネーションコンポーネント -->
          <app-pagination
            :length="userStaffs.pages"
            :count="userStaffs.count"
            v-on:paginate="changePage"
          ></app-pagination>

          <v-btn color="primary">New Item</v-btn>
      </v-toolbar>

      <v-data-table
        :headers="headers"
        :items="userStaffs.results"
        :hide-actions="true"
        class="elevation-1"
      >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.staffNumber }}</td>
          <td>{{ props.item.loginUser }}</td>
          <td>{{ props.item.fullName }}</td>
          <td>{{ props.item.email }}</td>
          <td>{{ props.item.mobile }}</td>
        </template>
      </v-data-table>

      <v-footer 
        card
        height="auto"
      >
      </v-footer>
    </v-card>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Pagination from "@/components/Module/Pagination.vue";

export default {
  title: "Staff master",
  name: "Staff",
  data() {
    return {
      headers: [
        { text: "Staff number", value: "staffNumber" },
        { text: "Login id", value: "isLoginUser" },
        { text: "Full name", value: "fullName" },
        { text: "E-mail", value: "email" },
        { text: "Mobile", value: "mobile" }
      ]
    };
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemUserApi", ["userStaffs"])
  },
  methods: {
    ...mapActions("systemUserApi", ["getStaffs"]),
    changePage: function(page) {
      this.getStaffs({
        params: { company: this.loginUserData.companyId, page: page }
      });
    }
  },
  created() {
    this.getStaffs({
      params: { company: this.loginUserData.companyId }
    });
  },
  components: {
    "app-pagination": Pagination
  }
};
</script>
