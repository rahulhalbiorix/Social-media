<template>
  <!-- Full-width single column layout -->

  <v-col cols="12">
    <v-card elevation="4" class="d-flex flex-column rounded-lg overflow-hidden">
      <!-- Post Title -->
      <v-card-title class="text-h6 font-weight-bold">
        {{ post.title }}
      </v-card-title>

      <!-- Post Author -->
      <v-card-subtitle class="text-grey-darken-1 pb-2">
        Posted by: <span class="font-weight-medium">{{ post.user.userName }}</span>
      </v-card-subtitle>

      <!-- Post Description -->
      <v-card-text class="pb-4">
        <div class="description">{{ post.description }}</div>
      </v-card-text>

      <v-spacer />

      <!-- Post Actions -->
      <v-card-actions class="d-flex align-center justify-start gap-2">
        <!-- Like Button -->
        <v-btn icon variant="text" @click="toggleLike(post._id)">
          <v-icon :color="likeButtonStore.isPostLiked(post._id) ? 'red' : 'grey'">
            {{ likeButtonStore.isPostLiked(post._id) ? 'mdi-heart' : 'mdi-heart-outline' }}
          </v-icon>
          <span class="ml-1">
            {{ likeButtonStore.isPostLiked(post._id) ? post.likesCount + 1 : post.likesCount }}
          </span>
        </v-btn>

        <!-- Comment Button -->
        <v-btn icon variant="text" @click="fetchComments(post._id)">
          <v-icon>mdi-comment</v-icon>
          <span class="ml-1">{{ post.commentsCount }}</span>
        </v-btn>

        <!-- Edit Button -->
        <v-btn icon variant="text" color="blue" @click="editPost(post)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>

        <!-- Delete Button (only for owner) -->
        <v-btn
          icon
          variant="text"
          color="red"
          v-if="post.user.userName === userContentStore.userName"
          @click="deletePost(post._id)"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-card-actions>

      <!-- Comment Dialog -->
      <v-dialog max-width="600" v-model="showCommentSection">
        <CommentSection
          @close="showCommentSection = false"
          @fetch-comment-list="fetchComments(post._id)"
          :comments="commentsTree"
          :postId="post._id"
        />
      </v-dialog>
    </v-card>
  </v-col>
</template>

<style scoped>
.description {
  white-space: pre-line;
  font-size: 0.95rem;
  color: #374151; /* dark gray */
}

.v-card {
  transition: box-shadow 0.2s ease;
}

.v-card:hover {
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import type { Post } from '@/Interfaces/Post'
import { useUserContent } from '@/stores/userContent'
import { useLikeButton } from '@/stores/useLikeButton'
import CommentSection from './CommentSection.vue'
import { fetchCommentAPI } from '@/API/ApiServices'
import { useToast } from '@/composables/useToasts'
import { id } from 'vuetify/locale'

const { success } = useToast()

const likeButtonStore = useLikeButton()

const userContentStore = useUserContent()

const props = defineProps<{ post: Post }>()

const showCommentSection = ref(false)

const commentsTree = ref([])

const emit = defineEmits<{
  (e: 'edit', post: any): void
  (e: 'delete', postId: string): void
  (e: 'toggle-like', postId: string): void
  (e: 'fetch-post-list'): void
}>()

function editPost(post: Post) {
  emit('edit', post)
}

function deletePost(postId: string) {
  emit('delete', postId)
}

function toggleLike(postId: string) {
  emit('toggle-like', postId)
}

async function fetchComments(postId: string) {
  try {
    const res = await fetchCommentAPI(postId)

    if (res.data.success) {
      success(res.data.message)
    }

    showCommentSection.value = true
    commentsTree.value = res.data.data.commentsTree
    emit('fetch-post-list')
  } catch (error) {
    console.log(error)
  }
}
</script>
