<template>
  <v-dialog v-model="dialog" scrollable max-width="600px">
    <v-btn slot="activator" color="primary" dark class="mb-2">New Item</v-btn>
    <v-card>
      <v-card-title>
        <span class="headline">{{ formTitle }}</span>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <!-- フォーム内容 -->
      <v-card-text id="card-text">
        <v-container grid-list-md>
          <v-form @submit.prevent="submitForm" :id="formName">

            <!-- フォームコンテンツスロット -->
            <slot name="dialog-contents"></slot>

          </v-form>
        </v-container>
      </v-card-text>
      <v-divider></v-divider>
      <!-- フォーム操作 -->
      <v-card-actions>
        <v-btn color="darken-1" outline @click="dialog = false">Cansel</v-btn>

        <v-spacer></v-spacer>

        <v-btn 
          color="darken-1"
          outline
          @click="clearForm"
        >Clear</v-btn>

        <v-btn 
          :form="formName"
          color="blue darken-1"
          type="submit"
          outline
        >Save</v-btn>
        
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>

<script>
export default {
  name: "Dialog",
  data() {
    return {
      dialog: false,
      editedIndex: -1
    };
  },
  props: {
    formName: { required: true }
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    }
  },
  watch: {
    dialog() {
      // ダイアログが閉じられた場合フォーム内容を削除する
      if (!this.dialog) {
        this.clearForm();
        this.editedIndex = -1;
      }
    }
  },
  methods: {
    // 編集ダイアログのオープン
    editForm() {
      this.dialog = true;
      this.editedIndex = 0;
    },
    // フォームのクリア
    clearForm() {
      this.$emit("clear-form");
    },
    // フォームの送信アクション発火
    submitForm() {
      this.$emit("submit-form");
    },
    closeDialog() {
      this.dialog = false;
    }
  }
};
</script>
