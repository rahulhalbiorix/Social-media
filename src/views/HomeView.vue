<template>
  <v-container fluid>
    <post-list :posts="posts" @refresh="fetchPosts" />
  </v-container>
  <!-- **********dialogue box for create and edit post************** -->
  <v-dialog v-model="dialogueStore.showCreatePostPopUp">
    <PostForm @refresh="fetchPosts"></PostForm>
  </v-dialog>
  <v-btn
    prepend-icon="mdi-plus"
    color="blue"
    style="position: fixed; bottom: 20px; right: 20px"
    rounded="xl"
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
