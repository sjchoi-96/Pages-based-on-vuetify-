<template>
  <v-container>
    <v-form ref="form" v-model="valid" class="responsive-form">
      <v-text-field
        v-model="patientName"
        :rules="nameRules"
        label="환자 이름"
        required
        outlined
        variant="solo-filled"
        color="primary"
        class="custom-design-textfield"
      />
      <v-text-field
        v-model="patientId"
        :rules="idRules"
        label="환자 ID"
        required
        outlined
        variant="solo-filled"
        class="custom-design-textfield"
      />

      <!-- 생년월일 텍스트 필드와 연결된 Date Picker -->
      <v-menu
        v-model="datePickerVisible"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template #activator="{ props }">
          <v-text-field
            v-model="birthDate"
            :rules="dateRules"
            label="생년월일 (YYYY-MM-DD)"
            required
            outlined
            variant="solo-filled"
            color="primary"
            class="custom-design-textfield"
            v-bind="props"
          />
        </template>
        <v-date-picker
          v-model="selectedDate"
          :max="maxDate"
          color="green lighten-1"
          @update:model-value="updateBirthDate"
        />
      </v-menu>

      <!-- 메모 필드 추가 -->
      <v-textarea
        v-model="memo"
        label="메모"
        outlined
        variant="solo-filled"
        row-height="30"
        rows="10"
        class="custom-design-textfield"
      />

      <v-tooltip text="환자정보를 저장합니다.">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            :disabled="!valid"
            color="primary"
            @click="submitPatientInfo"
            outlined
          >
            저장
          </v-btn>
        </template>
      </v-tooltip>
    </v-form>
  </v-container>

  <!-- 환자 정보 저장 완료 알림 -->
  <v-snackbar
    v-model="showSnackbar"
    timeout="1500"
    color="success"
    centered
    bottom
    class="custom-snackbar"
  >
    <div class="snackbar-content">환자정보 저장 완료</div>
  </v-snackbar>
</template>

<script lang="ts">
import { ref, defineComponent, PropType } from "vue";

export default defineComponent({
  props: {
    patientNameProp: {
      type: String as PropType<string>,
      default: "",
    },
    patientIdProp: {
      type: String as PropType<string>,
      default: "",
    },
    birthDateProp: {
      type: String as PropType<string>,
      default: "",
    },
  },
  setup(props, { emit }) {
    console.log("PatientInfoForm 호출 완료");

    const valid = ref<boolean>(false);
    const patientName = ref<string>(props.patientNameProp);
    const patientId = ref<string>(props.patientIdProp);
    const birthDate = ref<string>(props.birthDateProp);
    const selectedDate = ref<string | null>(null); // Date Picker 선택 날짜
    const memo = ref<string>(""); // 메모 필드 추가
    const showSnackbar = ref<boolean>(false); // 스낵바 표시 상태
    const datePickerVisible = ref<boolean>(false); // Date Picker 표시 상태
    const maxDate = new Date().toISOString().split("T")[0]; // 오늘 이후 날짜 선택 불가

    // 유효성 검사 규칙
    const nameRules = [(v: string) => !!v || "이름을 입력해주세요."];
    const idRules = [(v: string) => !!v || "ID를 입력해주세요."];
    const dateRules = [
      (v: string) => !!v || "생년월일을 입력해주세요.",
      (v: string) =>
        /^\d{4}-\d{2}-\d{2}$/.test(v) || "YYYY-MM-DD 형식으로 입력해주세요.",
    ];

    // 선택된 날짜를 YYYY-MM-DD 형식으로 업데이트
    const updateBirthDate = (date: string | null) => {
      if (date) {
        const formattedDate = new Date(date).toISOString().split("T")[0];
        birthDate.value = formattedDate; // 형식 변환된 날짜를 birthDate에 저장
        datePickerVisible.value = false; // Date Picker 닫기
        console.log("Updated birthDate:", birthDate.value);
      }
    };

    // 제출 함수 정의
    const submitPatientInfo = () => {
      const patientInfo = {
        name: patientName.value,
        id: patientId.value,
        birthDate: birthDate.value,
        memo: memo.value, // 메모 필드 포함
      };
      emit("completed", patientInfo); // 부모 컴포넌트로 데이터 전송
      console.log("Emit patient info:", patientInfo);
      showSnackbar.value = true; // 스낵바 표시
    };

    return {
      valid,
      patientName,
      patientId,
      birthDate,
      selectedDate,
      memo,
      nameRules,
      idRules,
      dateRules,
      updateBirthDate,
      submitPatientInfo,
      showSnackbar,
      datePickerVisible,
      maxDate,
    };
  },
});
</script>

<style scoped>
.v-container {
  border: 2px solid #ddd;
  overflow: auto; /* 스크롤바 추가 */
  height: 80vh; /* 전체 화면 높이 설정 */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.responsive-form {
  width: 100%; /* 부모 컨테이너에 맞춰 너비 조정 */
  max-width: 500px; /* 최대 너비 설정 */
}

.custom-design-textfield {
  margin-bottom: 20px; /* 상하 간격 조정 */
  width: 100%; /* 텍스트 필드도 부모의 너비에 맞춰 조정 */
}

.custom-snackbar .snackbar-content {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
</style>
