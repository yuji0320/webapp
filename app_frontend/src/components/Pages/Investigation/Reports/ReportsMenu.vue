<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card>
          <!-- Cardヘッダー -->
          <v-toolbar card>
            <v-icon>poll</v-icon>
            <v-toolbar-title class="font-weight-light">
              Sales Reports
            </v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <v-layout row>
              <v-flex sm6 xs12>
                <v-btn large block outline color="primary" @click="salesSummary">
                  Sales by period
                </v-btn>
              </v-flex>
              <v-flex sm6 xs12>
                <v-btn large block outline color="primary" @click="test">
                  Open PO
                </v-btn>
              </v-flex>
            </v-layout>
          </v-card-text>
          <!-- Cardフッター -->
          <v-footer 
            card
            height="auto"
          >
          </v-footer>
        </v-card>
      </v-flex>

      <v-flex xs12>
        <v-card>
          <!-- Cardヘッダー -->
          <v-toolbar card>
            <v-icon>poll</v-icon>
            <v-toolbar-title class="font-weight-light">
              Purchasing Reports
            </v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <v-layout row>
              <v-flex sm6 xs12>
                <v-btn large block outline color="error" @click="test">
                  Purchase by Supplier Summary
                </v-btn>
              </v-flex>
              <v-flex sm6 xs12>
                <v-btn large block outline color="error" @click="test">
                  Purchase by Supplier Detail
                </v-btn>
              </v-flex>
              <v-flex sm6 xs12>
                <v-btn large block outline color="error" @click="test">
                  Purchase by Products Summary
                </v-btn>
              </v-flex>
              <v-flex sm6 xs12>
                <v-btn large block outline color="error" @click="test">
                  Purchase by Products Detail
                </v-btn>
              </v-flex>





            </v-layout>
          </v-card-text>
          <!-- Cardフッター -->
          <v-footer card height="auto"></v-footer>
        </v-card>
      </v-flex>




    </v-layout>
  </v-container>
</template>

<script>
export default {
  title: "Reports",
  name: "Reports",
  data() {
    return {};
  },
  methods: {
    test() {
      console.log("test");
    },
    salesSummary() {
      // console.log("sales summary");
      this.$router.push({ name: "SalesByPeriod" });
    }
  }
}
</script>

<style>

</style>
