<template>
  <v-app>
    <v-container>
      <!-- Stepper Header -->
      <v-stepper v-model="currentStep">
        <v-stepper-header class="stepper-header">
          <v-stepper-step
            v-for="(step, index) in steps"
            :key="index"
            :step="index + 1"
            :complete="currentStep > index + 1"
            :color="currentStep === index + 1 ? 'primary' : ''"
            class="step-header"
            :class="{
              'active-step': currentStep === index + 1,
              'clickable-step': true,
            }"
            @click="goToStep(index + 1)"
          >
            <!-- 이미지 추가 -->
            <img :src="getStepImage(index + 1)" class="step-image" />
            <span>{{ step }}</span>
            <!-- 텍스트를 span 태그로 감쌈 -->
          </v-stepper-step>
        </v-stepper-header>

        <!-- Grid Layout for Components -->
        <div class="grid-container">
          <div v-for="(step, index) in steps" :key="index">
            <keep-alive>
              <component
                v-if="currentStep >= index + 1"
                :is="getStepComponent(index + 1)"
                class="grid-item"
              />
            </keep-alive>
          </div>
        </div>
      </v-stepper>

      <!-- Navigation Buttons -->
      <v-card-actions class="step-buttons">
        <v-btn
          outlined
          color="secondary"
          @click="prevStep"
          v-if="currentStep > 1"
          class="navigation-btn"
        >
          Previous
        </v-btn>
        <v-btn
          outlined
          color="primary"
          @click="nextStep"
          v-if="currentStep < steps.length"
          class="navigation-btn"
        >
          Next
        </v-btn>
        <v-btn
          color="success"
          @click="finishStepper"
          v-if="currentStep === steps.length"
          class="navigation-btn"
        >
          Finish
        </v-btn>
      </v-card-actions>
    </v-container>
  </v-app>
</template>

<script lang="ts">
import { ref } from "vue";
import PatientInfoForm from "./components/PatientInfoForm.vue";
import PanoramicAndAxialViewer from "./components/PanoramicAndAxialViewer.vue";
import ThreeDimViewer from "./components/ThreeDimViewer.vue";

import step1Image from "@/assets/stepperHeaderImage/document_pencil.svg";
import step2Image from "@/assets/stepperHeaderImage/landscape_photo_frame.svg";
import step3Image from "@/assets/stepperHeaderImage/simple_3d_cube.svg";

export default {
  name: "DynamicGridStepper",
  setup() {
    const steps = ["Patient Info", "Image Viewer", "3D Viewer"];
    const currentStep = ref(1);

    const nextStep = () => {
      if (currentStep.value < steps.length) currentStep.value++;
    };

    const prevStep = () => {
      if (currentStep.value > 1) currentStep.value--;
    };

    const finishStepper = () => {
      alert("모든 단계가 완료되었습니다.");
    };

    const goToStep = (step: number) => {
      if (step >= 1 && step <= steps.length) {
        currentStep.value = step;
      }
    };

    const getStepComponent = (step: number) => {
      switch (step) {
        case 1:
          return PatientInfoForm;
        case 2:
          return PanoramicAndAxialViewer;
        case 3:
          return ThreeDimViewer;
        default:
          return null;
      }
    };

    const getStepImage = (step: number) => {
      switch (step) {
        case 1:
          return step1Image;
        case 2:
          return step2Image;
        case 3:
          return step3Image;
        default:
          return "";
      }
    };

    return {
      steps,
      currentStep,
      nextStep,
      prevStep,
      finishStepper,
      goToStep,
      getStepComponent,
      getStepImage,
    };
  },
};
</script>

<style>
/* Step Header: 크기 고정 및 정렬 */
.stepper-header {
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  border-radius: 10px; /* 라운드 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 그림자 */
  background-color: #f5f5f5c4;
}

/* 스텝 헤더 */
.step-header {
  font-size: 30px; /* 기본 글씨 크기 */
  width: 200px; /* 고정된 너비 */
  height: 50px; /* 고정된 높이 */
  /*글씨 크기가 변하더라도 레이아웃이 바뀌지 않도록 보장*/
  line-height: 50px; /* 텍스트를 세로 중앙 정렬 */
  text-align: center; /* 텍스트를 항상 중앙에 정렬 */

  white-space: nowrap; /* 텍스트 줄바꿈 방지 */
}

.step-header:hover .step-image {
  transform: scale(1.3);
}

/* 활성화된 스텝 */
.active-step {
  color: black; /* 활성화된 텍스트 색상 */
  transform: scale(1.1); /* 글씨 크기를 확대하는 대신 transform 사용 */
}

/* Card Actions: 위치 통일 */
.step-buttons {
  display: flex;
  justify-content: flex-start; /* 버튼을 왼쪽 정렬 */
  gap: 16px; /* 버튼 간 간격 */
  position: fixed; /* 버튼을 항상 고정 */
  bottom: 16px; /* 화면 하단에 고정 */
  left: 16px; /* 화면 왼쪽에서 여백 추가 */
  width: fit-content; /* 버튼 그룹의 너비를 내용에 맞게 설정 */
  padding: 8px; /* 내부 여백 설정 */
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1); /* 상단 그림자 */
  z-index: 200; /* 다른 요소보다 위에 표시 */
  border-radius: 8px; /* 모서리를 살짝 둥글게 설정 */
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3열 레이아웃 유지 */
  gap: 16px;
  margin-top: 16px;
}

.grid-item {
  border: 2px solid #ddd;
  padding: 16px;
  border-radius: 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 80vh;
  opacity: 1; /* opacity를 1로 설정 */
  animation: fadeIn 0.3s ease-in-out; /* 페이드인 애니메이션 추가 */
}

/* 네비게이션 버튼 */
.step-navigation-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 16px;
}

.step-image {
  width: 50px; /* 이미지 너비 */
  height: 50px; /* 이미지 높이 */
  margin-right: 8px; /* 텍스트와의 간격 */
  vertical-align: middle; /* 텍스트와 수직 정렬 */
}
</style>
