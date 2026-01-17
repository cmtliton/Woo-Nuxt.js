// app/stores/snackbar.ts
import { defineStore } from "pinia";

export const useSnackbarStore = defineStore("snackbar", () => {
  const show = ref(false);
  const message = ref("");
  const color = ref("success");
  const timeout = ref(3000);

  function showMessage({
    msg,
    clr = "success",
    time = 3000,
  }: {
    msg: string;
    clr?: string;
    time?: number;
  }) {
    message.value = msg;
    color.value = clr;
    timeout.value = time;
    show.value = true;
  }

  return { show, message, color, timeout, showMessage };
});
