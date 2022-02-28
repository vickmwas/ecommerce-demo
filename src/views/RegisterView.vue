<template>
  <form class="auth-form">
    <h1>Welcome to Wingi!</h1>
    <p>Create your Merchant Account Below</p>

    <div class="input-wrapper">
      <input
        type="text"
        v-model="registration.merchant_name"
        placeholder="Merchant Name"
      />
      <i class="bx bxs-user-pin"></i>
    </div>

    <div class="input-wrapper">
      <input type="text" v-model="registration.email" placeholder="Merchant Email Address" />
      <i class="bx bxl-gmail"></i>
    </div>

    <div class="input-wrapper">
      <input type="text" v-model="registration.phone" placeholder="Merchant Phone Number" />
      <i class="bx bxs-phone"></i>
    </div>

    <div class="input-wrapper">
      <input type="text" v-model="registration.store_name" placeholder="Store Name" />
      <i class="bx bxs-store-alt"></i>
    </div>

    <div class="input-wrapper">
      <input type="password" v-model="registration.password" placeholder="Enter your Login Password" />
      <i class="bx bx-key"></i>
    </div>

    <div>
      <button type="submit" @click="submitRegistration">
        Create Account
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import router from "@/router";
import { reactive } from "vue";
import StoreDataService from "../services/StoreDataService";
import { ElNotification } from 'element-plus';

const registration = reactive({
  merchant_name: "",
  email: "",
  phone: "",
  store_name: "",
  password: "",
});

const submitRegistration = (event: Event) => {
  event.preventDefault();
  if (registration.merchant_name == "") {
    ElNotification({
      title: 'Error',
      message: 'Invalid merchant name',
      type: 'error',
    });
  } else if (registration.email == "") {
    ElNotification({
      title: 'Error',
      message: 'Invalid Email',
      type: 'error',
    });
  } else if (registration.phone == "") {
    ElNotification({
      title: 'Error',
      message: '"Invalid phone',
      type: 'error',
    });
  } else if (registration.store_name == "") {
    ElNotification({
      title: 'Error',
      message: 'Invalid store name',
      type: 'error',
    });
  } else if (registration.password == "") {
    console.log("");
    ElNotification({
      title: 'Error',
      message: 'Invalid password',
      type: 'error',
    });
  } else {
    StoreDataService.register(registration)
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
</style>
