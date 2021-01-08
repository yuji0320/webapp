<template>
  <span>
    <v-btn large block outlined @click="openDIalog">
      Search Inventory
    </v-btn>

    <!-- 絞り込み検索ダイアログ -->
    <app-dialog
      :formName="'inventoryMasterForm'"
      hideButtons="true"
      dialogWidth="800"
      dialogTitle="Search Inventory"
      ref="dialog"
    >
      test
    </app-dialog>
  </span>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Dialog from '@/components/Module/Dialogs/Dialog.vue';

export default {
  name: "SearchInventoryDialog",
  props: {
    hideButtons: { required: false },
    editDisable: { required: false },
  },
  components: {
    "app-dialog": Dialog,
  },
  computed: {},
  methods: {
    openDIalog(){
      this.$refs.dialog.editForm();
    },
    setDefault(){

    },
    submitInventoryMaster(){

    }
  },
  mounted() {
    // this.$refs.manufacturer.clearItem();
  }
}
</script>