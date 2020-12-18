<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <!-- 在庫マスター登録 -->
      <v-flex xs12 md6>
        <app-card noSearchBar="true">
          <span slot="card-header-icon"><v-icon>list_alt</v-icon></span>
          <span slot="card-header-title">Inventory Master</span>

          <span slot="card-content">
            <br>
            <v-layout row>
              <v-flex sm6 xs12>
                <v-btn large block outlined @click="masterList(false)">
                  In-stock Parts Master
                </v-btn>
              </v-flex>
              <v-flex sm6 xs12>
                <v-btn large block outlined @click="masterList(true)" disabled>
                  Standard Inventory Master
                </v-btn>
              </v-flex>
              <v-flex sm6 xs12>
                <v-btn large block outlined  :to="{ name: 'LocationMasterList' }">
                  Location Master
                </v-btn>
              </v-flex>
            </v-layout>
          </span>
        </app-card>
      </v-flex>

      <!-- 棚卸資料印刷 -->
      <v-flex xs12 md6>
        <app-card noSearchBar="true">
          <span slot="card-header-icon"><v-icon>print</v-icon></span>
          <span slot="card-header-title">Inventory Reports</span>

          <span slot="card-content">
            <br>
            <v-layout row>
              <v-flex sm6 xs12>
                <v-btn large block outlined :to="{ name: '' }" disabled>
                  Print In-stock Parts List
                </v-btn>
              </v-flex>
              <v-flex sm6 xs12>
                <v-btn large block outlined :to="{ name: '' }" disabled>
                  Print Standard Inventory List
                </v-btn>
              </v-flex>
            </v-layout>
          </span>
        </app-card>
      </v-flex>

    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  title: "InventoryMasterMenu",
  name: "InventoryMasterMenu",
  data() {
    return {}
  },
  computed: {
    ...mapState("inventoryDataAPI", ["isStandardInventory"]),
  },
  methods: {
    ...mapActions("inventoryDataAPI", ["setIsStandardInventory"]),
    masterList(isStandard) {
      this.setIsStandardInventory(isStandard);
      this.$router.push({ name: "InventoryMasterList" });
    }
  }
}
</script>

<style>

</style>