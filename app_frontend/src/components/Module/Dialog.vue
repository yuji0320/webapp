<template>
  <v-dialog v-model="dialog" scrollable :max-width="width">
    <v-btn slot="activator" color="primary" dark class="mb-2" v-show="!hideButtons">{{ openButton }}</v-btn>
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

            <!-- フォームコンテンツスロット -->
            <slot name="dialog-contents"></slot>

          <!-- </v-form> -->
        </v-container>
      </v-card-text>
      <v-divider></v-divider>
      <!-- フォーム操作 -->
      <v-card-actions>
        <v-btn color="darken-1" outline @click="dialog = false">Cancel</v-btn>

        <v-spacer></v-spacer>

        <!-- 拡張ボタンスロット -->
        <slot name="expand-button"></slot>

        <v-spacer></v-spacer>

        <v-btn 
          color="darken-1"
          outline
          @click="clearForm"
          v-show="!hideButtons"
        >Clear</v-btn>

        <v-btn 
          :form="formName"
          color="blue darken-1"
          type="submit"
          outline
          @click="submitForm"
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
      editedIndex: -1,
      defaultWidth: "600px"
    };
  },
  props: {
    formName: { required: true },
    dialogTitle: { required: false },
    dialogOpenButton: { required: false },
    hideButtons: { required: false },
    dialogWidth: { required: false },
    parentTitle: { required: false },
  },
  computed: {
    openButton() {
      let button = "New Item";
      if(this.dialogOpenButton) { button = this.dialogOpenButton; };
      return button
    },
    formTitle() {
      let title = this.editedIndex === -1 ? "New Item" : "Edit Item";
      // 親から指定があればフォームタイトルを変更する
      if(this.parentTitle) { title = title + " (" + this.parentTitle + ")" }
      if(this.dialogTitle) { title = this.dialogTitle; };
      return title;
    },
    width() {
      if(this.dialogWidth) {
        return this.dialogWidth;
      } else {
        return this.defaultWidth;
      }
    }
  },
  watch: {
    dialog() {
      // ダイアログが閉じられた場合フォーム内容を削除する
      if (!this.dialog) {
        this.clearForm();
        this.editedIndex = -1;
      } else if (this.dialog && this.editedIndex==-1) {
        // デフォルト値がある場合はセットする
        this.$emit("set-default");
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
