<template>
  <v-tooltip
    text="클릭하여 이미지를 업로드하세요. (지원 형식: JPG, JPEG, PNG)"
    location="bottom"
  >
    <template v-slot:activator="{ props }">
      <div @click="triggerFileUpload" class="upload-container" v-bind="props">
        <input
          type="file"
          ref="fileInput"
          style="display: none"
          accept=".jpg,.jpeg,.png"
          @change="handleFileUpload"
        />
        <img v-if="uploadedImage" :src="uploadedImage" alt="업로드된 이미지" />
        <p v-else style="color: black">이미지</p>
      </div>
    </template>
  </v-tooltip>
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

    // 파일 확장자 검사 함수
    const isValidImageFile = (file: File): boolean => {
      const validExtensions = ["jpg", "jpeg", "png"];
      const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
      return validExtensions.includes(fileExtension);
    };

    // 파일 업로드 처리 함수
    const handleFileUpload = (event: Event) => {
      console.log("handleFileUpload 호출됨");
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];

      if (file && isValidImageFile(file)) {
        uploadedImage.value = URL.createObjectURL(file);
        console.log("파일 업로드 완료, 부모로 이벤트 전송");
        emit("completed", file); // 부모 컴포넌트로 데이터 전송
      } else {
        alert("JPG 또는 PNG 파일만 업로드할 수 있습니다.");
        if (target) target.value = ""; // 파일 입력 초기화
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
.upload-container {
  display: flex; /* Flexbox를 사용하여 요소를 배치 */
  justify-content: center; /* 가로 방향으로 요소를 가운데 정렬 */
  align-items: center; /* 세로 방향으로 요소를 가운데 정렬 */
  border: 2px dashed #ccc; /* 업로드 영역을 구분하는 회색 점선 테두리 */
  background-color: #f5f5f5e1; /* 약간 투명한 밝은 회색 배경색 */
}

.upload-container:hover {
  background-color: #e0e0e0; /* 마우스 오버 시 배경색 변경 */
}

.upload-container img {
  max-width: 100%;
  max-height: 100%;
  display: block;
  padding: 0;
}
</style>
