<template>
  <v-container fluid class="pa-6 bg-light">
    <post-list :posts="posts" @refresh="fetchPosts" />
  </v-container>

  <!-- ********** Dialogue box for create and edit post ************** -->
  <v-dialog
    v-model="dialogueStore.showCreatePostPopUp"
    max-width="600"
    transition="dialog-bottom-transition"
  >
    <PostForm min-width="600" @refresh="fetchPosts" />
  </v-dialog>

  <!-- Floating Add Post Button -->
  <v-btn
    prepend-icon="mdi-plus"
    color="blue"
    class="floating-btn"
    rounded="xl"
    elevation="6"
    @click="dialogueStore.showCreatePostPopUp = true"
  >
    Add New Post
  </v-btn>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import PostList from '@/components/PostList.vue'
import { fetchPostsAPI } from '@/API/ApiServices'
import type { Post } from '@/Interfaces/Post'
import PostForm from '@/components/PostForm.vue'
import { usePostDialgueBox } from '@/stores/usePostDialogue'

const dialogueStore = usePostDialgueBox()
const posts = ref<Post[]>([])

const fetchPosts = async () => {
  try {
    const response = await fetchPostsAPI()
    posts.value = response.data.data.posts
  } catch (error) {
    console.error('Error fetching posts:', error)
  }
}

onMounted(() => {
  fetchPosts()
})
</script>

<style scoped>
.bg-light {
  background-color: #f9fafb;
  min-height: 100vh;
}

.floating-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  font-weight: 600;
  text-transform: none;
}

.v-dialog {
  border-radius: 12px;
}
</style>
