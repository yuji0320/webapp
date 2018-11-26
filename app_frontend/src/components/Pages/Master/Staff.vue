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

          <!-- 新規作成/編集モーダル -->
          <v-dialog v-model="dialog" scrollable max-width="600px">>
            <v-btn slot="activator" color="primary" dark class="mb-2">New Item</v-btn>
            <v-card>
              <v-card-title>
                <span class="headline">New Item</span>
              </v-card-title>
              <v-card-text>
                <v-container grid-list-md>
                  <v-form @submit.prevent="submitStaff" id="staffForm">
                    <v-layout wrap>
                      <v-flex xs6>
                        <v-text-field 
                          v-validate="'required|numeric'"
                          v-model="form.staffNumber.data"
                          label="form.staffNumber.label"
                          :error-messages="errors.collect('Staff Number')"
                          data-vv-name="Staff Number"
                          required
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs6>
                        <v-text-field label="Company*" required></v-text-field>
                      </v-flex>
                      <v-flex xs6>
                        <v-text-field label="Full Name*" required></v-text-field>
                      </v-flex>
                      <v-flex xs6>
                        <v-text-field label="Ruby"></v-text-field>
                      </v-flex>
                      <v-flex xs12>
                        <v-text-field label="Mobile"></v-text-field>
                      </v-flex>
                      <v-flex xs12>
                        <v-text-field label="E-mail"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6 md4>
                        <v-text-field label="Postal Code"></v-text-field>
                      </v-flex>
                      <v-flex xs12>
                        <v-textarea label="Address"></v-textarea>
                      </v-flex>
                    </v-layout>
                  </v-form>
                </v-container>
                <small>*indicates required field</small>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" flat @click="dialog = false">Close</v-btn>
                <v-btn 
                  color="blue darken-1"
                  form="staffForm"
                  type="submit"
                  flat
                >Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
      </v-toolbar>

      <v-card-title>
        <!-- ページネーションコンポーネント -->
        <app-pagination
          :length="userStaffs.pages"
          :count="userStaffs.count"
          v-on:paginate="changePage"
        ></app-pagination>
        <v-subheader>
          Total : {{ userStaffs.count }} items
        </v-subheader>
        <v-spacer></v-spacer>
      </v-card-title>
      
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
      ],
      dialog: false,
      form: {
        staffNumber:{
          label: "Staff Number",
          data: "",
          name: "staffNumber"
        }
      }
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
    },
    submitStaff: function() {
      this.$validator.validateAll().then(result => {
        if(result){
          console.log("Submit!");
        } else {
          console.log("There is some validation error!");
          console.log(this.error);
        }
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
