<template>
  <form class="auth-form">
    <h1>Welcome back to Wingi!</h1>
    <p>Enter your credentials to Log In.</p>

    <div class="input-wrapper">
      <input
        type="text"
        v-model="auth.email"
        placeholder="Enter your email address"
      />
      <i class="bx bxs-user-circle"></i>
    </div>

    <div class="input-wrapper">
      <input
        type="password"
        v-model="auth.password"
        placeholder="Enter your password"
      />
      <i class="bx bx-key"></i>
    </div>

    <div>
      <button type="submit" @click="submitLogin">Log In</button>
    </div>
  </form>
</template>

<script setup lang="ts">
import router from "@/router";
import { reactive } from "vue";
import StoreDataService from "../services/StoreDataService";
import { ElNotification } from 'element-plus';

// do not use same name with ref
const auth = reactive({
  email: "",
  password: "",
});

const submitLogin = (event: Event) => {
  event.preventDefault();
  if (auth.email == "") {
    ElNotification({
      title: 'Error',
      message: 'Invalid Email',
      type: 'error',
    });
    console.log("Invalid Email");
  } else if (auth.password == "") {
    console.log("Invalid password");
    ElNotification({
      title: 'Error',
      message: 'Invalid password',
      type: 'error',
    });
  } else {
    StoreDataService.login(auth)
      .then((response: any) => {
        window.localStorage.setItem("token", response.data.access_token);
        window.localStorage.setItem("user", JSON.stringify(response.data.user));

        router.push({ name: "admin" });
      })
      .catch((e: any) => {
        console.log(e);
      });
  }
};
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}

.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button {
  padding: 0;
  min-height: auto;
}

.image {
  width: 100%;
  display: block;
}
</style>
