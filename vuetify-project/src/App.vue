<template>
  <v-app>
    <v-container>
      <!-- Stepper Header -->
      <v-stepper v-model="currentStep" flat>
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
            {{ step }}
          </v-stepper-step>
        </v-stepper-header>

        <!-- Grid Layout for Components -->
        <div class="grid-container">
          <div
            v-for="(step, index) in steps"
            :key="index"
            class="grid-item"
            :class="{ visible: currentStep >= index + 1 }"
          >
            <keep-alive>
              <component :is="getStepComponent(index + 1)" />
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
      alert("All steps completed!");
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

    return {
      steps,
      currentStep,
      nextStep,
      prevStep,
      finishStepper,
      goToStep,
      getStepComponent,
    };
  },
};
</script>

<style scoped>
.v-application__wrap {
  overflow: hidden; /* 스크롤바 숨기기 */
  height: 300px; /* 전체 뷰포트 높이 설정 */
  display: flex;
  flex-direction: column;
}
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
  transition: color 0.3s ease, transform 0.3s ease; /* 부드러운 색상 및 효과 전환 */
}

/* 활성화된 스텝 */
.active-step {
  color: #1976d2; /* 활성화된 텍스트 색상 */
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
  grid-template-columns: repeat(3, 1fr); /* 3열 레이아웃 */
  gap: 16px; /* 각 컴포넌트 간 간격 */
  margin-top: 16px;
}

.grid-item {
  border: 1px solid #ddd; /* 컴포넌트 테두리 */
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  opacity: 0;
  transform: scale(0.95);
  transition: opacity 0.3s ease, transform 0.3s ease;
  height: 85vh;
}

.grid-item.visible {
  opacity: 1;
  height: 85vh;
}

/* 네비게이션 버튼 */
.step-navigation-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 16px;
}
</style>
