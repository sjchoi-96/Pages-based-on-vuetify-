<template>
  <div class="viewer-container">
    <ImageUpload
      class="upload-panoramic"
      imageType="panoramic"
      @completed="(file) => handleImageLoaded('panoramic')(file)"
    />
    <ImageUpload
      class="upload-axial"
      imageType="axial"
      @completed="(file) => handleImageLoaded('axial')(file)"
    />
    <ImageUpload
      class="upload-arch-curve-in-UI"
      imageType="crossSectional"
      @completed="(file) => handleImageLoaded('crossSectional')(file)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import ImageUpload from "./ImageUpload.vue";

export default defineComponent({
  name: "PanoramicAndAxialViewer",
  components: { ImageUpload },

  setup(props, { emit }) {
    console.log("PanoramicAndAxialViewer 호출 완료");

    // 각각의 이미지 타입에 대한 로드 상태를 추적
    const loadedImages = ref<{ [key: string]: boolean }>({
      panoramic: false,
      axial: false,
      crossSectional: false,
    });

    // 각 이미지 타입의 로드 완료 시 호출
    const handleImageLoaded = (imageType: string) => {
      return (file: File) => {
        console.log(
          `${imageType} handleImageLoaded in panoramicAndAxialViewer 호출 완료`
        );

        // 해당 이미지 타입을 true로 설정하여 로드 완료를 표시
        loadedImages.value[imageType] = true;

        // 모든 이미지 타입이 로드 완료되었는지 확인
        const allLoaded = Object.values(loadedImages.value).every(
          (status) => status
        );

        if (allLoaded) {
          console.log("모든 이미지 로드 완료. 부모로 이벤트 전송");
          emit("completed", { file, types: Object.keys(loadedImages.value) }); // 부모 컴포넌트로 데이터 전송
        }
      };
    };

    return {
      handleImageLoaded,
    };
  },
});
</script>

<style scoped>
/* 컨테이너를 Grid로 정의 */
.viewer-container {
  display: grid;
  grid-template-columns: 1fr 1fr; /* 2열 구성 */
  grid-template-rows: 1fr 1fr; /* 2행 구성, 행 비율 조정 */
  gap: 20px; /* 각 요소 간 간격 */
  width: 100%; /* 전체 너비 */
  height: 100vh; /* 전체 화면 높이에서 버튼 영역 제외 */
  padding: 20px;
  box-sizing: border-box; /* 패딩 포함 크기 계산 */
}

/* Arch Curve in UI: 1행~2행 1열 */
.upload-arch-curve-in-UI {
  grid-row: 1 / 3; /* 2행까지 차지 */
  grid-column: 1; /* 1열 */
  width: 100%; /* 가로 길이 조정 */
  height: 75%; /* 높이를 조정하여 버튼 영역 확보 */
  border: 2px solid #00ff77;
  border-radius: 8px; /* 둥근 모서리 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
}

/* Panoramic: 1행 2열 */
.upload-panoramic {
  grid-column: 2; /* 2열 */
  grid-row: 1; /* 1행 */
  width: 100%; /* 가로 길이 자동 조정 */
  height: 50%; /* 높이를 조정하여 버튼 영역 확보 */
  border: 2px solid #0077ff;
  border-radius: 8px; /* 둥근 모서리 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
}

/* Axial: 2행 2열 */
.upload-axial {
  grid-column: 2; /* 2열 */
  grid-row: 2; /* 2행 */
  width: 100%; /* 가로 길이 자동 조정 */
  height: 50%; /* 높이를 조정하여 버튼 영역 확보 */
  border: 2px solid #ff7700;
  border-radius: 8px; /* 둥근 모서리 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
}
</style>
