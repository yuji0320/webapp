<template>
  <v-container 
    fluid
    grid-list-lg
  >
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
        <v-text-field
        :disabled="!isEditing"
        label="Counrty"
        ></v-text-field>
        <v-text-field
        :disabled="!isEditing"
        label="Company name"
        ></v-text-field>
        <v-text-field
        :disabled="!isEditing"
        label="Postal code"
        ></v-text-field>
        <v-text-field
        :disabled="!isEditing"
        label="Address"
        ></v-text-field>
        <v-text-field
        :disabled="!isEditing"
        label="Phone"
        ></v-text-field>
        <v-text-field
        :disabled="!isEditing"
        label="Fax"
        ></v-text-field>
        <v-text-field
        :disabled="!isEditing"
        label="Default currency"
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
    ...mapState("systemUserApi", ["userCompany"])
  },
  methods: {
    ...mapActions("systemUserApi", ["getCompany"])
  },
  mounted() {
    this.getCompany({ID:"1"});
    // console.log(params);
  }
};
</script>

<style>
</style>
