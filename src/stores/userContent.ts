import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserContent = defineStore(
  'userContent',
  () => {
    const userName = ref('')

    function setUserName(uname: string) {
      userName.value = uname
    }

    return {
      userName,
      setUserName,
    }
  },
  {
    persist: {
      key: 'userContent',
      storage: localStorage,
    },
  },
)
