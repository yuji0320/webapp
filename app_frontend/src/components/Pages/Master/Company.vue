<template>
  <v-container 
    fluid
    grid-list-lg
  >
  {{ countries }}
    <v-card>
      <v-toolbar card>
        <v-icon>domain</v-icon>
        <v-toolbar-title class="font-weight-light">Company Master</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          fab
          small
          @click="isEditing = !isEditing"
        >
          <v-icon v-if="isEditing">close</v-icon>
          <v-icon v-else>edit</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <!-- 会社情報表示 -->
        <!-- <v-text-field
        :disabled="!isEditing"
        label="Counrty"
        v-model="userCompany.country"
        ></v-text-field> -->

        <v-text-field
        :disabled="!isEditing"
        label="Company name"
        v-model="userCompany.name"
        ></v-text-field>
        <v-text-field
        :disabled="!isEditing"
        label="Postal code"
        v-model="userCompany.postalCode"
        ></v-text-field>
        <v-text-field
        :disabled="!isEditing"
        label="Address"
        v-model="userCompany.address"
        ></v-text-field>
        <v-text-field
        :disabled="!isEditing"
        label="Phone"
        v-model="userCompany.phone"
        ></v-text-field>
        <v-text-field
        :disabled="!isEditing"
        label="Fax"
        v-model="userCompany.fax"
        ></v-text-field>
        <v-text-field
        :disabled=true
        label="Default currency"
        v-model="userCompany.defaultCurrency"
        ></v-text-field>
      </v-card-text>
    </v-card>

  </v-container>  
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  title: "Company",
  name: "Company",
  data() {
    return {
      isEditing: false
    };
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemUserApi", ["userCompany"]),
    ...mapState("systemMasterApi", ["countries"])
  },
  methods: {
    ...mapActions("systemUserApi", ["getCompany"]),
    ...mapActions("systemMasterApi", ["getCountries"])
  },
  mounted() {
    this.getCompany({detail:this.loginUserData.companyId});
    this.getCountries();
    // console.log(params);
  }
};
</script>

<style>
</style>
