<template>
  <v-container fluid style="border: 2px solid red">
    <v-row dense>
      <v-col v-for="post in posts" :key="post._id" cols="12" sm="6" md="4">
        <PostCard :post="post" @edit="editPost" @delete="deletePost" @toggle-like="toggleLike" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import PostCard from './PostCard.vue'
import type { Post } from '@/Interfaces/Post'
import { useToast } from '@/composables/useToasts'
import { usePostDialgueBox } from '@/stores/usePostDialogue'
import { deletePostAPI, toggleLikeButton } from '@/API/ApiServices'
import { useLikeButton } from '@/stores/useLikeButton'

const { success } = useToast()

const dialogue = usePostDialgueBox()

const likeButtonStore = useLikeButton()

const props = defineProps<{
  posts: Post[]
}>()

const emit = defineEmits<{
  (e: 'refresh'): void
}>()

function editPost(post: Post) {
  dialogue.setEditingPostId(post._id)
  dialogue.setBlogDescription(post.description)
  dialogue.setBlogTitle(post.title)
  dialogue.setMode()
  dialogue.showCreatePostPopUp = true
}

async function deletePost(postId: string) {
  try {
    const res = await deletePostAPI(postId)

    if (res.data.success) {
      success(res.data.message)
    }

    emit('refresh')
  } catch (error) {
    console.log('phases issues in delete post', error)
  }
}

async function toggleLike(postId: string) {
  const likeData = {
    targetId: postId,
    type: 'comment',
  }

  try {
    const res = await toggleLikeButton(likeData)

    if (res.data.success) {
      success(res.data.message)
    }

    likeButtonStore.setLike(postId, res.data.data === 1)

    emit('refresh')
  } catch (error) {
    console.log(error)
  }
}
</script>

<style>
.fab-btn {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
}
</style>
