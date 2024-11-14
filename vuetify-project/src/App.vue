<template>
  <v-app>
    <!-- 최상단 툴바에 컴포넌트 목록을 표시 -->
    <v-app-bar app color="primary" dark>
      <div class="main-content">
        <v-chip
          v-for="(title, index) in stepTitles"
          :key="index"
          :color="index + 1 === activeStep ? 'white' : 'grey lighten-2'"
          :text-color="index + 1 === activeStep ? 'primary' : 'grey darken-1'"
          outlined
          class="step-chip"
        >
          <strong v-if="index + 1 === activeStep">{{ title }}</strong>
          <span v-else>{{ title }}</span>
        </v-chip>
      </div>
    </v-app-bar>

    <v-container fluid class="main-container">
      <!-- 현재 진행 중인 단계만 렌더링 -->
      <div class="step-box">
        <h3 :style="{ color: 'black' }">{{ stepTitles[activeStep - 1] }}</h3>
        <!-- keep-alive를 사용하여 이전 단계의 컴포넌트 데이터를 남겨놓음 -->
        <keep-alive>
          <component
            :is="getStepComponent(activeStep)"
            @completed="handleStepEvent"
          />
        </keep-alive>
      </div>

      <!-- 네비게이션 버튼 -->
      <div class="step-navigation-buttons">
        <v-btn
          color="secondary"
          @click="prevStep"
          v-if="activeStep > 1"
          outlined
        >
          이전 단계
        </v-btn>
        <v-btn
          color="primary"
          @click="nextStep"
          :disabled="!canProceed && activeStep < totalSteps"
          outlined
        >
          다음 단계
        </v-btn>
      </div>
    </v-container>
  </v-app>
</template>

<script lang="ts">
import { ref, Ref } from "vue";
import PatientInfoForm from "./components/PatientInfoForm.vue"; // PatientInfoForm 컴포넌트 가져오기
import PanoramicAndAxialViewer from "./components/panoramicAndAxialViewer.vue"; // ImageUpload 컴포넌트 가져오기
import ThreeDimViewer from "./components/ThreeDimViewer.vue";

export default {
  name: "App",
  components: {
    PatientInfoForm,
    PanoramicAndAxialViewer,
    ThreeDimViewer,
  },
  setup() {
    // 반응형 변수 정의
    const totalSteps: number = 3;
    const activeStep: Ref<number> = ref(1);
    const completedSteps: Ref<number[]> = ref([]);
    const patientName: Ref<string> = ref("");
    const birthDate: Ref<string> = ref("");
    const patientId: Ref<string> = ref("");
    const patientImage: Ref<File | null> = ref(null);
    const threeDimModel: Ref<File | null> = ref(null);
    const isPatientInfoComplete: Ref<boolean> = ref(false);
    const canProceed: Ref<boolean> = ref(false);
    const stepTitles: string[] = [
      "환자 정보 입력",
      "이미지 뷰어",
      "3D 모델 뷰어",
    ];

    // 현재 단계를 완료했을 때 실행되는 함수
    const handleStepCompleted = () => {
      canProceed.value = true;
    };

    // 다음 단계로 이동하는 함수
    const nextStep = () => {
      if (activeStep.value <= totalSteps) {
        completedSteps.value.push(activeStep.value);
        activeStep.value++;
        canProceed.value = false;
      }
    };

    // 이전 단계로 이동하는 함수
    const prevStep = () => {
      if (activeStep.value > 1) {
        completedSteps.value.pop();
        activeStep.value--;
        canProceed.value = true;
      }
    };

    interface PatientInfo {
      name: string;
      birthDate: string;
      id: string;
    }

    // 이벤트 핸들러
    const handleStepEvent = (eventData: PatientInfo | File) => {
      console.log("handleStepEvent 호출됨, 데이터:", eventData);

      if (activeStep.value === 1) {
        if (
          typeof eventData === "object" &&
          "name" in eventData &&
          "birthDate" in eventData &&
          "id" in eventData
        ) {
          const patientInfo = eventData as PatientInfo;
          patientName.value = patientInfo.name;
          birthDate.value = patientInfo.birthDate;
          patientId.value = patientInfo.id;
          isPatientInfoComplete.value = true;
          console.log("환자 정보 입력 단계 완료");
        } else {
          console.error("Invalid eventData format for patient info");
        }
      } else if (activeStep.value === 2) {
        if (eventData instanceof File) {
          patientImage.value = eventData;
          console.log("이미지 뷰어 단계 완료");
        } else {
          console.error("Invalid eventData format for image file");
        }
      } else if (activeStep.value === 3) {
        if (eventData instanceof File) {
          threeDimModel.value = eventData;
          console.log("3D 모델 뷰어 단계 완료");
        } else {
          console.error("Invalid eventData format for 3D model file");
        }
      }
      handleStepCompleted();
    };

    const getStepComponent = (step: number) => {
      if (step === 1) {
        console.log("PatientInfoForm 호출 요청");
        return PatientInfoForm;
      }
      if (step === 2) {
        console.log("PanoramicAndAxialViewer 호출 요청");
        return PanoramicAndAxialViewer;
      }
      if (step === 3) {
        console.log("ThreeDimViewer 호출 요청");
        return ThreeDimViewer;
      }
      return null;
    };

    return {
      activeStep,
      totalSteps,
      completedSteps,
      patientName,
      birthDate,
      patientImage,
      isPatientInfoComplete,
      canProceed,
      stepTitles,
      nextStep,
      prevStep,
      getStepComponent,
      handleStepEvent,
    };
  },
};
</script>

<style>
/* 전역 스타일 */
.v-application__wrap {
  overflow: hidden; /* 스크롤바 숨기기 */
  height: 100vh; /* 전체 뷰포트 높이 설정 */
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5e1; /* 배경색 설정 */
}

.v-app-bar {
  flex-shrink: 0; /* v-app-bar가 축소되지 않도록 설정 */
}

.main-content {
  flex-grow: 1; /* 남은 공간을 차지하도록 설정 */
  overflow-y: auto; /* 세로 스크롤 가능하도록 설정 */
}

.step-navigation-buttons {
  flex-shrink: 0; /* 축소되지 않도록 설정 */
  position: fixed; /* 화면에 고정 */
  bottom: 0; /* 화면의 아래쪽에 위치 */
  width: 100%; /* 전체 너비 차지 */
  display: flex; /* 플렉스 박스 사용 */
  justify-content: center; /* 중앙 정렬 */
  align-items: center; /* 수직 중앙 정렬 */
  z-index: 1000; /* 다른 요소들 위에 표시되도록 설정 */
}
</style>
