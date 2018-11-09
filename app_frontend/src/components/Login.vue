<template>
  <v-container fluid>

    <!-- ヘッダーツールバー -->
    <v-toolbar app >
      <v-toolbar-title v-text="headerTitle"></v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Login form</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent="onLogin" id="loginForm">
              <v-alert 
                :value="true"
                type="error"
                v-if="responseError.data"
              >
                {{ responseError.data.nonFieldErrors[0] }}
              </v-alert>
              <v-text-field 
                v-model="username" 
                name="username"
                v-validate="'required|alpha_dash'"
                :class="{'has-error': errors.has('username')}"
                prepend-icon="person" 
                label="Username" 
                type="text"
              ></v-text-field>
              <v-alert 
                :value="true"
                type="error"
                outline
                v-if="errors.has('username')"
              >
                {{ errors.first('username') }}
              </v-alert>
              <v-text-field 
                v-model="password" 
                name="password" 
                v-validate="'required|alpha_dash'"
                :class="{'has-error': errors.has('password')}"
                prepend-icon="lock" 
                label="Password" 
                type="password"
              ></v-text-field>
              <v-alert 
                :value="true"
                type="error"
                outline
                v-if="errors.has('password')"
              >
                {{ errors.first('password') }}
              </v-alert>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn 
              color="primary"
              form="loginForm"
              type="submit"
            >Login</v-btn> 
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>        
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  title: "login",
  name: "login",
  data() {
    return {
      username: "",
      password: "",
      headerTitle: "Business Management System"
    };
  },
  computed: {
    ...mapState("auth", ["loggedIn", "responseError"])
  },
  methods: {
    ...mapActions("auth", ["login"]),
    onLogin: function() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.login({
            username: this.$data.username,
            password: this.$data.password,
            router: this.$router
          });
        }
      });
    }
  },
  mounted: function() {
    // もしログイン状態の時はメインメニューにリダイレクト
    if (this.loggedIn) {
      this.$router.push({ name: "Main" });
    }
  }
};
</script>
