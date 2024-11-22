// Styles
import "vuetify/styles";

// Composables
import { createVuetify } from "vuetify";
import "vuetify/styles"; // Vuetify 기본 스타일
import "@mdi/font/css/materialdesignicons.css"; // Material Design Icons
import { aliases, mdi } from "vuetify/iconsets/mdi";

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: "dark",
  },
  icons: {
    defaultSet: "mdi", // Material Design Icons를 기본 아이콘 세트로 설정
    aliases, // 아이콘 별칭
    sets: {
      mdi, // MDI 아이콘 세트 추가
    },
  },
});
