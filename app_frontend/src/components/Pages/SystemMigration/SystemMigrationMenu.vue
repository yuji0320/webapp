<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <!-- 従業員マスタ登録 -->
      <v-flex xs12>
        <migrate-staff v-if="false"></migrate-staff>
      </v-flex>
      <!-- 取引先マスタ登録 -->
      <v-flex xs12>
        <migrate-partner v-if="false"></migrate-partner>
      </v-flex>
      <!-- メーカーマスタ登録 -->
      <v-flex xs12>
        <migrate-manufacturer v-if="false"></migrate-manufacturer>
      </v-flex>
      <!-- 作業指図書登録 -->
      <v-flex xs12>
        <migrate-joborder></migrate-joborder>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import MigrateStaff from "./01MigrateStaff.vue";
import MigratePartner from "./02MigratePartner.vue";
import MigrateManufacturer from "./03MigrateManufacturer.vue";
import MigrateJoborder from "./04MigrateJoborder.vue";


export default {
  title: "SystemMigrationMenu",
  name: "SystemMigrationMenu",
  components: {
    "migrate-staff": MigrateStaff,
    "migrate-partner": MigratePartner,
    "migrate-manufacturer": MigrateManufacturer,
    "migrate-joborder": MigrateJoborder,
  },

}
</script>