<template>
  <div @click="triggerFileUpload" class="upload-container">
    <input
      type="file"
      ref="fileInput"
      style="display: none"
      @change="handleFileUpload"
    />
    <img v-if="uploadedImage" :src="uploadedImage" alt="업로드된 이미지" />
    <p v-else style="color: black">이미지를 업로드하려면 클릭하세요.</p>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from "vue";

export default defineComponent({
  setup(props, { emit }) {
    console.log("ImageUpload 호출됨");

    // 반응형 변수 정의
    const uploadedImage = ref<string | null>(null);
    const fileInput = ref<HTMLInputElement | null>(null);

    // 파일 업로드 트리거 함수
    const triggerFileUpload = () => {
      console.log("triggerFileUpload 호출됨");
      fileInput.value?.click();
    };

    // 파일 업로드 처리 함수
    const handleFileUpload = (event: Event) => {
      console.log("handleFileUpload 호출됨");
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file && file.type.startsWith("image/")) {
        uploadedImage.value = URL.createObjectURL(file);
        console.log("파일 업로드 완료, 부모로 이벤트 전송");
        emit("completed", file); // 부모 컴포넌트로 데이터 전송
      } else {
        console.error("이미지 파일만 업로드할 수 있습니다.");
      }
    };

    return {
      uploadedImage,
      fileInput,
      triggerFileUpload,
      handleFileUpload,
    };
  },
});
</script>

<style scoped>
/*이미지가 업로드되는 창의 디자인*/
.upload-container {
  width: 400px; /* 너비 설정 */
  height: 300px; /* 높이 설정 */
  display: flex; /* Flexbox를 사용하여 요소를 배치 */
  justify-content: center; /* 가로 방향으로 요소를 가운데 정렬 */
  align-items: center; /* 세로 방향으로 요소를 가운데 정렬 */
  border: 2px dashed #ccc; /* 업로드 영역을 구분하는 회색 점선 테두리 */
  background-color: #f5f5f5e1; /* 약간 투명한 밝은 회색 배경색 */
  margin-bottom: 16px; /* 아래쪽에 16px의 간격 추가 */
}

.upload-container img {
  max-width: 100%; /* 이미지가 컨테이너를 넘지 않도록 */
  max-height: 100%;
  display: block;
  padding: 0;
}
</style>
