<template>
  <v-app>
    <v-app-bar
      color="deep-purple-accent-4"
      dark
      elevation="4"
      class="px-4"
      v-if="userAuth.isUserLoggedIn"
    >
      <v-img
        src="../src/assets/images/ChatGPT Image Aug 6, 2025, 06_22_30 PM (1).png"
        alt="VibeHub Logo"
        max-height="100"
        max-width="100"
        contain
        class="mr-2 d-flex logo-shadow"
      />

      <v-spacer></v-spacer>

      <div class="d-flex align-center gap-2">
        <v-avatar size="36">
          <v-img :src="userImage" alt="User" />
        </v-avatar>
        <span class="font-weight-medium text-white">{{ userContent.userName }}</span>
        <v-btn icon="mdi-export" @click="logOut" />
      </div>
    </v-app-bar>

    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterView } from 'vue-router'
import { useUserAuth } from './stores/userAuth'
import { useUserContent } from './stores/userContent'
import router from './router/router'

const userAuth = useUserAuth()
const userContent = useUserContent()

const userImage = ref('https://i.pravatar.cc/300')

// ****logOut functionality ****

const logOut = () => {
  userAuth.userLoggedInSuccessFully('', false)

  router.push('/login')
}

// ******************
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}

.logo-shadow {
  border-radius: 12px;
  filter: drop-shadow(3px 3px 5px white);
}
</style>
