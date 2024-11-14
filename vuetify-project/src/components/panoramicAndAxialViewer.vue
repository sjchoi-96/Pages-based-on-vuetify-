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
  name: "panoramicAndAxialViewer",
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
.viewer-container {
  gap: 16px;
}

/* 각 ImageUpload 컴포넌트의 크기 및 위치를 조정 */
.upload-panoramic {
  position: absolute;
  top: 100px;
  right: 50px;
  width: 500px;
  height: 500px;
  border: 2px solid #0077ff;
  margin-bottom: 20px;
}

.upload-axial {
  position: absolute;
  top: 700px; /* 원하는 위치 조정 */
  right: 50px;
  width: 500px;
  height: 500px;
  border: 2px solid #ff7700;
  margin-bottom: 20px;
}

.upload-arch-curve-in-UI {
  position: absolute;
  top: 100px;
  left: 50px;
  width: 1500px;
  height: 1000px;
  border: 2px solid #00ff77;
}
</style>
