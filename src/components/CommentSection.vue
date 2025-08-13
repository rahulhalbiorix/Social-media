<template>
  <v-card>
    <v-toolbar color="blue" dark>
      <v-toolbar-title>Comments</v-toolbar-title>
      <v-spacer />
      <v-btn icon>
        <v-icon @click="emit('close')">mdi-close</v-icon>
      </v-btn>
    </v-toolbar>

    <v-card-text>
      <div class="text-center text-grey" v-if="comments.length == 0">No comments yet</div>

      <div v-else>
        <comment-item v-for="comment in comments" :key="comment._id" :comment="comment" />
      </div>

      <v-text-field
        label="Add a comment..."
        variant="outlined"
        dense
        clearable
        v-model="writeNewComment"
      />
      {{ writeNewComment }}
      <v-btn color="blue" @click="addNewCommenet(postId)">Post</v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CommentItem from './CommentItem.vue'
import type { Comments } from '@/Interfaces/Comments'
import { addCommentAPI } from '@/API/ApiServices'
import { fetchPostsAPI } from '@/API/ApiServices'
import { comment } from 'postcss'
import { useToast } from '@/composables/useToasts'

const { success } = useToast()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'fetch-comment-list', payload: string): void
}>()

const props = defineProps<{ comments: Comments[]; postId: string }>()

const writeNewComment = ref('')

async function addNewCommenet(id: string) {
  console.log(id)

  const newCommentData = {
    postId: id,
    text: writeNewComment.value,
  }

  try {
    const res = await addCommentAPI(newCommentData)

    if (res.data.success) {
      success(res.data.message)
    }

    emit('fetch-comment-list', id)
    writeNewComment.value = ''
  } catch (error) {
    console.log(error)
  }
}
</script>
