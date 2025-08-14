<template>
  <v-container fluid class="pa-4">
    <v-row dense class="d-flex justify-center">
      <v-col v-for="post in posts" :key="post._id" cols="12" class="d-flex justify-center">
        <PostCard
          :post="post"
          @edit="editPost"
          @delete="deletePost"
          @toggle-like="toggleLike"
          @fetch-post-list="emit('refresh')"
          class="w-100"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.v-container {
  background-color: #f9fafb; /* light neutral background */
  border-radius: 8px;
}

.v-row {
  row-gap: 16px; /* spacing between rows */
}

.v-col {
  max-width: 800px; /* keep post card nicely centered */
}

.PostCard {
  transition: box-shadow 0.25s ease;
}

.PostCard:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}
</style>

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
    console.log(error)
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
