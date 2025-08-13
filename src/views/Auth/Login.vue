<template>
  <div
    class="login-container d-flex align-center justify-center"
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
        border: 2px solid white;
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
      "
    >
      <div class="text-center mb-4">
        <v-img
          src="/src/assets/images/ChatGPT Image Aug 6, 2025, 06_22_30 PM (1).png"
          max-width="100"
          class="mx-auto logo-shadow"
          alt="vibeHub Logo"
          contain
        />
      </div>

      <v-card-title class="text-h6 text-center text-white mb-1"> Welcome Back </v-card-title>
      <v-card-subtitle class="text-center mb-4" style="color: #e0e0e0">
        Please sign in to continue
      </v-card-subtitle>

      <v-form ref="loginform" lazy-validation>
        <v-text-field
          label="UserName"
          variant="solo-filled"
          color="purple"
          v-model="username"
          :rules="[required, validUsername]"
          prepend-inner-icon="mdi-account"
          class="mb-3"
        />{{ username }}

        <v-text-field
          label="Password"
          variant="solo-filled"
          color="purple"
          type="password"
          v-model="password"
          :rules="[required, validPassword]"
          prepend-inner-icon="mdi-lock-outline"
        />{{ password }}

        <v-btn
          color="deep-purple-accent-4"
          size="large"
          block
          class="mt-5 glow-button"
          @click="login"
        >
          Login
        </v-btn>
      </v-form>

      <div class="text-center mt-4">
        <span style="color: #ddd">Don't have an account?</span>
        <v-btn variant="text" color="cyan-lighten-3" @click="router.push({ name: 'SignUp' })">
          Sign Up
        </v-btn>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import router from '@/router/router'
import { ref } from 'vue'
import axios from 'axios'
import { useUserAuth } from '@/stores/userAuth'
import { useUserContent } from '@/stores/userContent'
import { useToast } from '@/composables/useToasts'

const { success, error, warning } = useToast()

const authStore = useUserAuth()
const contentStore = useUserContent()

const username = ref('')
const password = ref('')
const loginform = ref()

const required = (v: any) => !!v || 'This field is required'
const validUsername = (v: any) =>
  /^(?=.{3,16}$)(?![_\.])(?!.*[_\.]{2})[a-zA-Z0-9._]+(?<![_\.])$/.test(v) ||
  'Username must be 3–16 characters, no special characters at start/end.'

const validPassword = (v: any) => v.length >= 6 || 'Password must be at least 6 characters'

// *******Login API calling***********

const login = async () => {
  const isValid = await loginform.value?.validate()

  if (!isValid.valid) {
    warning('Please fill all the fields')
    return
  }

  const userCredential = {
    userName: username.value,
    password: password.value,
  }

  axios
    .post('https://social-media-backend-bwrz.onrender.com/auth/login', userCredential)
    .then((res) => {
      if (res.data.success) {
        success(res.data.message)
      }
      contentStore.setUserName(res.data.data.userName)
      setTimeout(() => {
        router.push({ name: 'home' })
      }, 1000)
      authStore.userLoggedInSuccessFully(res.data.data.token, true)
    })
    .catch((err) => {
      if (err.response) {
        error(err.response.data.message)
      } else {
        console.log('Network  Error:', err.message)
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
  color: #f1f1f1; /* High contrast text */
  border: 1px solid #bb86fc; /* Light purple border */
  box-shadow: 0 0 12px #9e7bff; /* Soft violet glow */
}

.glow-button {
  transition: 0.3s ease;
  font-weight: bold;
  background-color: #ffd700; /* Gold CTA */
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
