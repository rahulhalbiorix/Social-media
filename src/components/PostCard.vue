<template>
  <v-card elevation="2" class="h-100 d-flex flex-column" style="border: 2px solid black">
    <v-card-title>{{ post.title }}</v-card-title>
    <v-card-subtitle class="text-grey">Posted by: {{ post.user.userName }} </v-card-subtitle>

    <v-card-text>
      <div class="description">{{ post.description }}</div>
    </v-card-text>

    <v-spacer />

    <v-card-actions>
      <v-btn icon variant="text" @click="toggleLike(post._id)">
        <v-icon :color="likeButtonStore.isPostLiked(post._id) ? 'red' : 'grey'">
          {{ likeButtonStore.isPostLiked(post._id) ? 'mdi-heart' : 'mdi-heart-outline' }}
        </v-icon>

        <span class="ml-1"
          >{{ likeButtonStore.isPostLiked(post._id) ? post.likesCount + 1 : post.likesCount }}
        </span>
      </v-btn>

      <v-btn icon variant="text" @click="fetchComments(post._id)">
        <v-icon>mdi-comment</v-icon>
        <span class="ml-1">{{ post.commentsCount }}</span>
      </v-btn>

      <v-btn icon variant="text" color="blue">
        <v-icon @click="editPost(post)">mdi-pencil</v-icon>
      </v-btn>

      <v-btn
        icon
        variant="text"
        color="red"
        v-if="post.user.userName === userContentStore.userName"
      >
        <v-icon @click="deletePost(post._id)">mdi-delete</v-icon>
      </v-btn>
    </v-card-actions>

    <v-dialog max-width="600" v-model="showCommentSection">
      <CommentSection
        @close="showCommentSection = false"
        @fetch-comment-list="fetchComments"
        :comments="commentsTree"
        :postId="post._id"
      />
    </v-dialog>
  </v-card>
</template>

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
  } catch (error) {
    console.log(error)
  }
}
</script>

<style>
.description {
  white-space: pre-line;
}
</style>
