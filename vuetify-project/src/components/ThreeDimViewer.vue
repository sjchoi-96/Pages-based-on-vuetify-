<template>
  <v-container>
    <div class="threeD-file-upload-container">
      <!-- 파일 선택 버튼과 파일 정보 컨테이너 -->
      <div class="controls-container">
        <v-btn class="custom-btn" @click="triggerFileUpload"> 파일 선택 </v-btn>
        <input
          type="file"
          ref="fileInput"
          @change="handleFileUpload"
          accept=".stl,.obj"
          style="display: none"
        />
        <div v-if="fileName" class="file-info">
          <p>{{ fileName }}</p>
        </div>
      </div>
    </div>
    <div id="viewer" ref="viewer" class="viewer-container"></div>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from "vue";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";

export default defineComponent({
  setup(props, { emit }) {
    console.log("ThreeDimViewer 호출 완료");
    // 반응형 변수 정의
    const fileInput = ref<HTMLInputElement | null>(null);
    const fileName = ref<string>("");
    const viewer = ref<HTMLDivElement | null>(null);
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;

    // 파일 업로드 트리거 함수
    const triggerFileUpload = () => {
      fileInput.value?.click();
    };

    // 파일 업로드 처리 함수
    const handleFileUpload = (event: Event) => {
      const target = event.target as HTMLInputElement | null;
      if (target && target.files) {
        const file = target.files[0];
        if (file) {
          fileName.value = file.name;
          load3DModel(file);
          console.log("3D 모델 로드 함수 호출됨");
          emit("completed", file); // 부모 컴포넌트로 데이터 전송
        }
      }
    };

    // 3D 모델 로드 함수
    const load3DModel = (file: File) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.result && viewer.value) {
          // Three.js 초기화
          scene = new THREE.Scene();
          camera = new THREE.PerspectiveCamera(
            75,
            viewer.value.clientWidth / viewer.value.clientHeight,
            0.1,
            1000
          );

          renderer = new THREE.WebGLRenderer({ antialias: true });
          renderer.setSize(viewer.value.clientWidth, viewer.value.clientHeight);
          viewer.value.innerHTML = "";
          viewer.value.appendChild(renderer.domElement);

          let loader;
          if (file.name.toLowerCase().endsWith(".obj")) {
            // OBJ 파일 로드
            loader = new OBJLoader();
            const objData = reader.result as string;
            const objModel = loader.parse(objData);
            objModel.traverse((child) => {
              if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                mesh.material = new THREE.MeshNormalMaterial();
              }
            });
            scene.add(objModel);
          } else if (file.name.toLowerCase().endsWith(".stl")) {
            // STL 파일 로드
            loader = new STLLoader();
            const stlData = reader.result as ArrayBuffer;
            const geometry = loader.parse(stlData);
            const material = new THREE.MeshNormalMaterial();
            const stlModel = new THREE.Mesh(geometry, material);
            scene.add(stlModel);
          } else {
            console.error("지원되지 않는 파일 형식입니다.");
            return;
          }

          camera.position.z = 10;

          const animate = () => {
            requestAnimationFrame(animate);
            scene.traverse((object) => {
              if (object instanceof THREE.Mesh) {
                object.rotation.x += 0.01;
                object.rotation.y += 0.01;
                object.rotation.z += 0.01;
              }
            });
            renderer.render(scene, camera);
          };

          animate();
        }
      };

      // .obj 파일은 텍스트로, .stl 파일은 바이너리로 읽기
      if (file.name.toLowerCase().endsWith(".obj")) {
        reader.readAsText(file);
      } else if (file.name.toLowerCase().endsWith(".stl")) {
        reader.readAsArrayBuffer(file);
      }
    };

    const resizeViewer = () => {
      if (viewer.value && renderer) {
        const width = viewer.value.clientWidth;
        const height = viewer.value.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
    };

    onMounted(() => {
      if (viewer.value) {
        viewer.value.style.width = "100%";
        viewer.value.style.height = "800px";
        window.addEventListener("resize", resizeViewer);
        resizeViewer();
      }
    });

    onBeforeUnmount(() => {
      window.removeEventListener("resize", resizeViewer);
    });

    return {
      fileInput,
      fileName,
      viewer,
      triggerFileUpload,
      handleFileUpload,
    };
  },
});
</script>

<style scoped>
.viewer-container {
  width: 100%;
  height: 800px;
  border: 1px solid #ccc;
  background-color: rgba(0, 0, 0, 1);
  position: relative; /* 내부 요소의 절대 배치를 위한 기준 */
}

/* 파일 선택 버튼 및 파일 정보 컨테이너 */
.controls-container {
  position: absolute; /* 부모의 상대적 위치에 따라 배치 */
  bottom: 150px; /* viewer-container의 하단에서 16px 띄움 */
  display: flex; /* 버튼과 파일 정보를 가로로 정렬 */
  align-items: center; /* 수직 중앙 정렬 */
  gap: 10px; /* 버튼과 파일 정보 간격 */
}

/* 파일 선택 버튼 */
.custom-btn {
  display: flex; /* 내부 콘텐츠를 정렬하기 위해 flexbox 사용 */
  justify-content: center; /* 수평 중앙 정렬 */
  align-items: center; /* 수직 중앙 정렬 */
  background-color: #1968cf; /* 배경색 */
  color: white; /* 텍스트 색상 */
  padding: 12px 30px; /* 버튼 내부 여백 */
  font-size: 18px; /* 텍스트 크기 */
  border-radius: 8px; /* 둥근 모서리 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
  text-align: center; /* 텍스트 정렬 */
}

/* 파일 정보 */
.file-info {
  font-size: 16px;
  color: white;
  padding: 8px;
  border-radius: 4px;
}
</style>
