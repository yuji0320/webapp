<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <!-- 従業員マスタ登録 -->
      <v-flex xs12>
        <migrate-staff v-if="false"></migrate-staff>
      </v-flex>
      <!-- 取引先マスタ登録 -->
      <v-flex xs12>
        <migrate-partner></migrate-partner>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import MigrateStaff from "./01MigrateStaff.vue";
import MigratePartner from "./02MigratePartner.vue";


export default {
  title: "SystemMigrationMenu",
  name: "SystemMigrationMenu",
  components: {
    "migrate-staff": MigrateStaff,
    "migrate-partner": MigratePartner,
  },

}
</script>