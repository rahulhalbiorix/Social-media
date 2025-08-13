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
      </v-list-item-content>

      <v-list-item-action v-if="comment.userId.userName === userStore.userName">
        <v-btn icon variant="text" size="small" @click="$emit('delete', comment._id)">
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
      <v-btn color="primary" size="small" @click="postReply">Post</v-btn>
    </div>

    <div class="ml-12">
      <CommentItem
        v-for="reply in comment.replies"
        :key="reply._id"
        :comment="reply"
        @delete="$emit('delete', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserContent } from '@/stores/userContent'
import type { Comments } from '@/Interfaces/Comments'

const props = defineProps<{ comment: Comments }>()
const emit = defineEmits(['delete'])

const userStore = useUserContent()
const replying = ref(false)
const newReply = ref('')

function formatDate(date: string) {
  return new Date(date).toLocaleString()
}

function postReply() {
  if (!newReply.value.trim()) return
  // Call API to post reply...
  newReply.value = ''
  replying.value = false
}
</script>

<style scoped>
.comment-item {
  padding: 10px 0;
  border-bottom: 1px solid #e5e7eb; /* light gray divider */
}

.v-list-item {
  align-items: flex-start;
}

.v-list-item-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1f2937; /* dark gray */
}

.v-list-item-subtitle {
  font-size: 0.9rem;
  color: #374151; /* slightly lighter gray */
}

.text-caption {
  font-size: 0.75rem;
  color: #6b7280; /* muted gray for meta info */
}

.ml-12 {
  margin-left: 3rem; /* consistent indentation for replies */
}

.reply-btn {
  font-size: 0.8rem;
  text-transform: none;
  color: #3b82f6; /* blue */
  padding: 0;
}

.reply-btn:hover {
  text-decoration: underline;
}

.v-text-field {
  max-width: 400px;
}

.reply-container {
  border-left: 2px solid #e5e7eb;
  padding-left: 1rem;
  margin-top: 0.5rem;
}
</style>
