import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserAuth = defineStore(
  'userAuth',
  () => {
    const token = ref('')

    const isUserLoggedIn = ref(false)

    function userLoggedInSuccessFully(tokenPayload: string, isloggedPayload: boolean) {
      token.value = tokenPayload
      isUserLoggedIn.value = isloggedPayload
    }

    return {
      token,
      isUserLoggedIn,
      userLoggedInSuccessFully,
    }
  },
  {
    persist: true,
  },
)
