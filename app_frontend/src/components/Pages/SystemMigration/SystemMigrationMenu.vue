<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <!-- 従業員マスタ登録 -->
      <!-- <v-flex xs12>
        <migrate-staff></migrate-staff>
      </v-flex> -->
      <!-- 取引先マスタ登録 -->
      <!-- <v-flex xs12>
        <migrate-partner></migrate-partner>
      </v-flex> -->
      <!-- メーカーマスタ登録 -->
      <!-- <v-flex xs12>
        <migrate-manufacturer></migrate-manufacturer>
      </v-flex> -->
      <!-- 作業指図書登録 -->
      <!-- <v-flex xs12>
        <migrate-joborder></migrate-joborder>
      </v-flex> -->
      <!-- 部品表登録 -->
      <v-flex xs12>
        <migrate-bom></migrate-bom>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import MigrateStaff from "./01MigrateStaff.vue";
import MigratePartner from "./02MigratePartner.vue";
import MigrateManufacturer from "./03MigrateManufacturer.vue";
import MigrateJoborder from "./04MigrateJoborder.vue";
import MigrateBOM from "./05MigrateBOM.vue";


export default {
  title: "SystemMigrationMenu",
  name: "SystemMigrationMenu",
  components: {
    "migrate-staff": MigrateStaff,
    "migrate-partner": MigratePartner,
    "migrate-manufacturer": MigrateManufacturer,
    "migrate-joborder": MigrateJoborder,
    "migrate-bom": MigrateBOM,
  },

}
</script>