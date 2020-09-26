<template>
  <v-container fluid grid-list-lg>
    <app-card>
      <!-- ヘッダー部分スロット -->
      <span slot="card-header-icon"><v-icon>account_circle</v-icon></span>
      <span slot="card-header-title">Change Password</span>

      <!-- Card内容 -->
      <span slot="card-content">
        <v-card-text>
          <v-layout align-center justify-center>
            <v-flex xs12 sm8 md4>
              <!-- パスワード変更フォーム -->
              <template v-if="!success">
                <v-form @submit.prevent="submitPassword" id="PasswordChangeForm">
                  <!-- エラー表示 -->
                  <v-flex xs12>
                    <v-alert 
                      value="true"
                      type="error"
                      v-if="responseError.nonFieldErrors"
                    >
                      <li
                        v-for="(error, index) in responseError.nonFieldErrors"
                        :key="index"
                      >
                        {{ error }}
                      </li>
                    </v-alert>
                  </v-flex>

                  <!-- 古いパスワード -->
                  <v-flex xs12>
                    <v-text-field 
                      label="Old Password*"
                      v-model="changePassword.oldPassword"
                      :error-messages="responseError.oldPassword"
                      outlined
                      type="password"
                    ></v-text-field>
                  </v-flex>

                  <!-- 新しいパスワード -->
                  <v-flex xs12>
                    <v-text-field 
                      label="New Password*"
                      v-model="changePassword.newPassword1"
                      :error-messages="error.newPassword1"
                      outlined
                      type="password"
                    ></v-text-field>
                  </v-flex>

                  <!-- パスワード確認 -->
                  <v-flex xs12>
                    <v-text-field 
                      label="Confirm Password*"
                      v-model="changePassword.newPassword2"
                      :error-messages="error.newPassword2"
                      outlined
                      type="password"
                    ></v-text-field>
                  </v-flex>
                </v-form>


                <v-flex xs12>
                  <div class="text-xs-right">
                    <v-btn 
                      color="primary"
                      form="PasswordChangeForm"
                      type="submit"
                      outlined
                      large
                    >Submit</v-btn> 
                  </div>
                </v-flex>

              </template>

              <!-- 成功時表示ページ -->
              <template v-if="success">
                <v-flex text-xs-center>
                  <h3>Passward successfully changed.</h3>
                </v-flex>
              </template>

            </v-flex>
          </v-layout>
        </v-card-text>
      </span>
    </app-card>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  title: "Change Password",
  name: "ChangePassword",
  data() {
    return {
      error: {
        newPassword1: "",
        newPassword2: ""
      },
      success: false
    }
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemUserApi", ["responseError", "changePassword"]),
  },
  methods: {
    ...mapActions("systemUserApi", ["putChangePassword"]),
    async submitPassword() {
      let res = {};

      // パスワード入力バリデーション
      if(!this.changePassword.newPassword1) {
        this.error.newPassword1 = ["This field is required."];
      } else {
        this.error.newPassword1 = [];
      }
      if(!this.changePassword.newPassword2) {
        this.error.newPassword2 = ["This field is required."];
      } else {
        this.error.newPassword2 = [];
      }
      if(this.changePassword.newPassword1&&this.changePassword.newPassword2) {
        // パスワード一致バリデーション
        if(this.changePassword.newPassword1 == this.changePassword.newPassword2) {
          this.error.newPassword1 = [];
          this.error.newPassword2 = [];
        } else {
          this.error.newPassword1 = ["Password is not same."];
          this.error.newPassword2 = ["Password is not same."];
        }
      }

      // エラーがない場合はリクエストを送信
      if(this.error.newPassword1.length < 1 &&this.error.newPassword2.length < 1) {
        this.changePassword.newPassword = this.changePassword.newPassword1;
        res = await this.putChangePassword(this.changePassword);

        // 成功時は成功ページを表示する
        if(!res.error) {
          this.success = true;
        }
      }
    }
  }
}
</script>

<style>

</style>
