<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <!-- 従業員マスタ登録 -->
      <v-flex xs12>
        <migrate-staff></migrate-staff>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import MigrateStaff from "./01MigrateStaff.vue";


export default {
  title: "SystemMigrationMenu",
  name: "SystemMigrationMenu",
  components: {
    "migrate-staff": MigrateStaff,
  },

}
</script>