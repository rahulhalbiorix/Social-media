<template>
  <div class="comment-item">
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="font-weight-medium">
          {{ comment.userId.userName }}
        </v-list-item-title>

        <v-list-item-subtitle>
          {{ comment.text }}
        </v-list-item-subtitle>

        <div class="text-caption text-grey">
          {{ formatDate(comment.createdAt) }}
        </div>
        <div class="d-flex align-center text-caption mt-1">
          <v-btn
            icon
            variant="text"
            size="x-small"
            :color="isLiked ? 'blue' : 'grey'"
            @click="handleLike(comment._id)"
          >
            <v-icon>{{ isLiked ? 'mdi-thumb-up' : 'mdi-thumb-up-outline' }}</v-icon>
          </v-btn>
          <span class="ml-1">{{ likeCount }}</span>
        </div>
      </v-list-item-content>

      <v-list-item-action v-if="comment.userId.userName === userStore.userName">
        <v-btn icon variant="text" size="small" @click="$emit('delete-comment', comment._id)">
          <v-icon color="red">mdi-delete</v-icon>
        </v-btn>
      </v-list-item-action>
    </v-list-item>

    <div class="d-flex align-center ml-12 mb-2">
      <v-btn variant="text" size="small" @click="replying = !replying"> Reply </v-btn>
    </div>

    <div v-if="replying" class="ml-12">
      <v-text-field
        v-model="newReply"
        label="Write a reply..."
        dense
        clearable
        variant="outlined"
      />
      <v-btn
        color="primary"
        size="small"
        @click="postReply(comment._id, parentReplyId || comment._id)"
        >Post</v-btn
      >
    </div>
    <div class="ml-12">
      <CommentItem
        v-for="reply in repliesArray"
        :key="reply._id"
        :comment="reply"
        :postId="postId"
        :parentReplyId="props.comment._id"
        @delete-comment="handleReplyDelete"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useUserContent } from '@/stores/userContent'
import type { Comments } from '@/Interfaces/Comments'
import { addReplyAPI, loadNestedReply, deleteReplyAPI, toggleLikeButton } from '@/API/ApiServices'
import { useToast } from '@/composables/useToasts'

const { success } = useToast()

const props = defineProps<{ comment: Comments; postId: string; parentReplyId?: string }>()
const emit = defineEmits(['delete-comment', 'post-reply'])

const userStore = useUserContent()
const replying = ref(false)
const newReply = ref('')
const repliesArray = ref<Comments[]>([])
const likeCount = ref(props.comment.likesCount || 0)
const isLiked = ref(props.comment.isLiked)

async function handleLike(id: string) {
  const payload = {
    targetId: id,
    type: props.parentReplyId ? 'reply' : 'comment',
  }

  try {
    const res = await toggleLikeButton(payload)

    if (res.data.success) {
      if (isLiked.value) {
        likeCount.value--
      } else {
        likeCount.value++
      }

      isLiked.value = !isLiked.value
    }
  } catch (err) {
    console.error('Like failed:', err)
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleString()
}

async function postReply(commentId: string, parentReplyId: string) {
  if (!newReply.value.trim()) return

  const replyData = {
    commentId: commentId,
    parentReplyId: parentReplyId,
    text: newReply.value,
    postId: props.postId,
  }

  try {
    const res = await addReplyAPI(replyData)

    if (res.data.success) {
      success(res.data.message)
    }

    await loadReply()
  } catch (error) {
    console.log(error)
  }

  newReply.value = ''
  replying.value = false
}

async function loadReply() {
  try {
    const res = await loadNestedReply(props.parentReplyId || props.comment._id, props.comment._id)

    repliesArray.value = res.data.data.replies
  } catch (error) {
    console.log(error)
  }
}

async function handleReplyDelete(replyId: string) {
  try {
    const res = await deleteReplyAPI(replyId)

    if (res.data.success) {
      success('Reply deleted successfully')
      repliesArray.value = res.data.data
      await loadReply()
    }
  } catch (error) {
    console.error('Failed to delete reply:', error)
  }
}

onMounted(() => {
  loadReply()
})
</script>

<style scoped>
.comment-item {
  padding: 12px 0;
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.2s ease;
}

.comment-item:hover {
  background-color: #f9fafb; /* light hover */
}

.v-list-item {
  align-items: flex-start;
}

.v-list-item-title {
  font-size: 1rem;
  font-weight: 600;
  color: #111827; /* dark gray for better contrast */
}

.v-list-item-subtitle {
  font-size: 0.9rem;
  color: #4b5563; /* medium gray */
  margin-top: 2px;
}

.text-caption {
  font-size: 0.75rem;
  color: #6b7280; /* muted gray */
}

.ml-12 {
  margin-left: 3rem;
}

.reply-btn {
  font-size: 0.8rem;
  text-transform: none;
  color: #2563eb; /* bright blue */
  padding: 0;
  transition: color 0.2s ease;
}

.reply-btn:hover {
  color: #1d4ed8; /* darker blue */
  text-decoration: underline;
}

.v-text-field {
  max-width: 420px;
}

.reply-container {
  border-left: 2px solid #e5e7eb;
  padding-left: 1rem;
  margin-top: 0.5rem;
}

.like-btn {
  transition:
    transform 0.2s ease,
    color 0.2s ease;
}

.like-btn:hover {
  transform: scale(1.1);
}

.delete-btn:hover {
  transform: rotate(10deg);
  transition: transform 0.2s ease;
}

.comment-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.comment-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
  color: #374151;
}
</style>
