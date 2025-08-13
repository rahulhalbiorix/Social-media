<template>
  <div
    class="signup-container d-flex align-center justify-center"
    style="min-height: 100vh; background: linear-gradient(135deg, #8e2de2, #4a00e0); padding: 20px"
  >
    <v-card
      class="glass-card pa-6"
      max-width="420"
      elevation="10"
      style="
        border-radius: 24px;
        backdrop-filter: blur(16px);
        background-color: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        border: 2px solid white;
        max-height: 96vh;
      "
    >
      <!-- vibeHub Logo -->
      <div class="text-center mb-1">
        <v-img
          src="/src/assets/images/ChatGPT Image Aug 6, 2025, 06_22_30 PM (1).png"
          max-width="100"
          class="mx-auto logo-shadow"
          alt="vibeHub Logo"
          contain
        />
      </div>

      <v-card-title class="text-h6 text-center text-white mb-1"> Create an Account </v-card-title>
      <v-card-subtitle class="text-center mb-4" style="color: #e0e0e0">
        Join us today! Please fill in the information below.
      </v-card-subtitle>

      <v-form ref="form" lazy-validation>
        <v-text-field
          label="UserName"
          variant="solo-filled"
          color="purple"
          v-model="userName"
          :rules="[required]"
          prepend-inner-icon="mdi-account"
          class="mb-3"
        />

        <v-text-field
          label="Password"
          type="password"
          variant="solo-filled"
          color="purple"
          v-model="password"
          :rules="[required, validPassword]"
          prepend-inner-icon="mdi-lock-outline"
        />

        <v-btn
          color="deep-purple-accent-4"
          size="large"
          block
          class="mt-5 glow-button"
          @click="signup"
        >
          Sign Up
        </v-btn>
      </v-form>

      <div class="text-center mt-4">
        <span style="color: #ddd">Already have an account?</span>
        <v-btn variant="text" color="cyan-lighten-3" @click="router.push({ name: 'Login' })">
          Login
        </v-btn>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import router from '@/router/router'
import axios from 'axios'
import { useToast } from '@/composables/useToasts'

const { success, error, warning } = useToast()

const userName = ref('')
const password = ref('')
const form = ref()

const required = (value: string) => !!value || 'This field is required'
const validPassword = (value: string) =>
  (value && value.length >= 6) || 'Password must be at least 6 characters long'

//**************Sign Up API calling ****************

async function signup() {
  const isValid = await form.value?.validate()
  if (!isValid.valid) {
    warning('Please fill all the fields')
    return
  }

  const userCredential = {
    userName: userName.value,
    password: password.value,
  }

  axios
    .post('https://social-media-backend-bwrz.onrender.com/auth/sign-up', userCredential)
    .then((res) => {
      if (res.data.success) {
        success(res.data.message)
        setTimeout(() => {
          router.push({ name: 'Login' })
        }, 1000)
      }
    })
    .catch((err) => {
      if (err.response) {
        error(err.response.data)
      } else {
        console.log('Network Error', err.message)
      }
    })
}
</script>

<style scoped>
.logo-shadow {
  border-radius: 12px;
  filter: drop-shadow(3px 3px 5px white);
}

.glass-card {
  animation: fadeInUp 0.6s ease-out;
  color: #f1f1f1;
  border: 1px solid #bb86fc;
  box-shadow: 0 0 12px #9e7bff;
}

.glow-button {
  transition: 0.3s ease;
  font-weight: bold;
  background-color: #ffd700;
  color: #212121;
}
.glow-button:hover {
  box-shadow:
    0 0 16px #ffd700,
    0 0 28px #bb86fc;
  transform: scale(1.02);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
