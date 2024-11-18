<template>
  <v-app>
    <v-container class="center-container">
      <v-form ref="form" v-model="valid">
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
        <v-text-field
          v-model="birthDate"
          :rules="dateRules"
          label="생년월일 (YYYY-MM-DD)"
          required
          outlined
          variant="solo-filled"
          class="custom-design-textfield"
        />
        <!-- 메모 필드 추가 -->
        <v-textarea
          v-model="memo"
          label="메모"
          outlined
          variant="solo-filled"
          class="custom-design-textfield"
        />
        <v-btn
          :disabled="!valid"
          color="primary"
          @click="submitPatientInfo"
          outlined
        >
          저장
        </v-btn>
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
  </v-app>
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
    // 반응형 변수 정의
    const valid = ref<boolean>(false);
    const patientName = ref<string>(props.patientNameProp);
    const patientId = ref<string>(props.patientIdProp);
    const birthDate = ref<string>(props.birthDateProp);
    const memo = ref<string>(""); // 메모 필드 추가
    const showSnackbar = ref<boolean>(false); // 스낵바 표시 상태

    // 유효성 검사 규칙
    const nameRules = [(v: string) => !!v || "이름을 입력해주세요."];
    const idRules = [(v: string) => !!v || "ID를 입력해주세요."];
    const dateRules = [
      (v: string) => !!v || "생년월일을 입력해주세요.",
      (v: string) =>
        /^\d{4}-\d{2}-\d{2}$/.test(v) || "YYYY-MM-DD 형식으로 입력해주세요.",
    ];

    // 제출 함수 정의
    const submitPatientInfo = () => {
      const patientInfo = {
        name: patientName.value,
        id: patientId.value,
        birthDate: birthDate.value,
        memo: memo.value, // 메모 필드 포함
      };
      emit("completed", patientInfo); // 부모 컴포넌트로 데이터 전송
      showSnackbar.value = true; // 스낵바 표시
    };

    return {
      valid,
      patientName,
      patientId,
      birthDate,
      memo,
      nameRules,
      idRules,
      dateRules,
      submitPatientInfo,
      showSnackbar,
    };
  },
});
</script>
<style scoped>
.center-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.custom-design-textfield {
  margin-bottom: 20px; /* 상하 간격 조정 */
  width: 500px;
}

.custom-snackbar .snackbar-content {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
</style>
