<template>
  <v-container>
    <div class="threeD-file-upload-container">
      <input
        type="file"
        ref="fileInput"
        @change="handleFileUpload"
        accept=".stl,.obj"
        style="display: none"
      />
      <v-btn color="primary" @click="triggerFileUpload">파일 선택</v-btn>
    </div>
    <div v-if="fileName" class="file-info">
      <p>선택된 파일: {{ fileName }}</p>
    </div>
    <div id="viewer" ref="viewer" class="viewer-container"></div>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
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

          renderer = new THREE.WebGLRenderer();
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
      if (viewer.value) {
        const width = viewer.value.clientWidth;
        const height = viewer.value.clientHeight;
        const renderer = viewer.value.querySelector("canvas");
        if (renderer) {
          renderer.width = width;
          renderer.height = height;
        }
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
}
</style>
