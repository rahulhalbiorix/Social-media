// stores/useLikeButton.ts
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useLikeButton = defineStore(
  'postLike',
  () => {
    const likedPosts = ref<Record<string, boolean>>({})

    function setLike(postId: string, value: boolean) {
      likedPosts.value[postId] = value
    }

    function isPostLiked(postId: string) {
      return likedPosts.value[postId] || false
    }

    return {
      likedPosts,
      setLike,
      isPostLiked,
    }
  },
  { persist: true },
)
