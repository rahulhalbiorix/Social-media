<template>
  <v-card elevation="4" class="rounded-lg">
    <!-- Toolbar -->
    <v-toolbar color="blue" dark flat>
      <v-toolbar-title class="text-h6 font-weight-bold">Comments</v-toolbar-title>
      <v-spacer />
      <v-btn icon variant="text" @click="emit('close')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>

    <v-card-text class="pa-4">
      <!-- No comments -->
      <div
        v-if="comments.length == 0"
        class="text-center text-grey py-8"
        style="font-size: 0.95rem"
      >
        No comments yet
      </div>

      <!-- Comment List -->
      <div v-else class="mb-4">
        <comment-item
          v-for="comment in comments"
          :key="comment._id"
          :comment="comment"
          :postId="postId"
          @delete-comment="deleteComment"
        />
      </div>

      <!-- Add Comment Field -->
      <v-text-field
        label="Add a comment..."
        variant="outlined"
        density="comfortable"
        rounded="lg"
        clearable
        v-model="writeNewComment"
        class="mb-3"
        hide-details
      >
        <template #prepend-inner>
          <v-icon color="grey">mdi-comment-text-outline</v-icon>
        </template>
      </v-text-field>

      <!-- Post Button -->
      <v-btn
        color="blue"
        block
        rounded="lg"
        class="text-none font-weight-medium"
        size="large"
        @click="addNewCommenet(postId)"
      >
        Post
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CommentItem from './CommentItem.vue'
import type { Comments } from '@/Interfaces/Comments'
import { addCommentAPI, deleteCommentAPI } from '@/API/ApiServices'

import { comment } from 'postcss'
import { useToast } from '@/composables/useToasts'

const { success } = useToast()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'fetch-comment-list'): void
}>()

const props = defineProps<{ comments: Comments[]; postId: string }>()

const writeNewComment = ref('')

async function addNewCommenet(id: string) {
  const newCommentData = {
    postId: id,
    text: writeNewComment.value,
  }

  try {
    const res = await addCommentAPI(newCommentData)

    if (res.data.success) {
      success(res.data.message)
    }

    emit('fetch-comment-list')
    writeNewComment.value = ''
  } catch (error) {
    console.log(error)
  }
}

async function deleteComment(id: string) {
  try {
    const res = await deleteCommentAPI(id)

    if (res.data.success) {
      success(res.data.message)
    }
    emit('fetch-comment-list')
  } catch (error) {
    console.log(error)
  }
}
</script>

<style scoped>
.v-card {
  transition: box-shadow 0.3s ease;
}

.v-card:hover {
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}
</style>
