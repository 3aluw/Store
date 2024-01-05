<template>
  <div>
    <div>
      <h2 class="card-title mb-5">Register</h2>
      <FormKit type="form" :config="{ validationVisibility: 'submit' }" @submit="handleRegistration" :actions="false"
        v-model="form">
        <FormKit type="text" label="Email" name="email" validation="required|email" />

        <FormKit type="password" name="password" label="Password" validation="required" />
        <FormKit type="password" name="password_confirm" label="Confirm password" validation="required|confirm"
          validation-label="Password" />
        <AppButton class="btn-primary block mx-auto" :loading="loading">Register</AppButton>
      </FormKit>
    </div>
    <button class="btn-primary login-with-google-btn block mx-auto" type="button" @click="OauthRegister">
      sign-up with Google
    </button>
  </div>
</template>
<script setup>
const router = useRouter();
const alerts = useAlertsStore();
const userOauthData = useCookie("userOauthData")

definePageMeta({
  layout: "form-focus",
});

const deskree = useDeskree();

const form = reactive({
  email: "",
  password: "",
  password_confirm: "",
});

const loading = ref(false);
async function handleRegistration(e) {
  loading.value = true;
  try {
    await deskree.auth.signUp(form);
    router.push("/");
    router.push("/user/profile");
    useAlertsStore().info("PLease fill your profile information")
  } catch (err) {
    alerts.error("Error registering, please contact support");
  } finally {
    loading.value = false;
  }
}

//Oauth logic
onMounted(() => {
  //get url
  const url = new URL(window.location.href)
  const params = new URLSearchParams(url.hash?.slice(1));
  const token = params.get("id_token");
  if (token && userOauthData.value) {
    userOauthData.value.callBackUri = "http://localhost:3000/register"
    userOauthData.value.token = token
    deskree.Oauth.signInOauth(userOauthData.value)
  }
})

const OauthRegister = async () => {
  const res = await deskree.Oauth.createOauthUrl("google.com", "http://localhost:3000/register");
  userOauthData.value = res
  await navigateTo(res.data.authUri, { external: true })
}
</script>
<style scoped>
.signin {
  display: flex;
  flex-direction: column;
}

.login-with-google-btn {
  transition: background-color 0.3s, box-shadow 0.3s;
  padding: 12px 16px 12px 42px;
  border: none;
  border-radius: 3px;
  box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.04), 0 1px 1px rgba(0, 0, 0, 0.25);
  color: #757575;
  font-size: 14px;
  font-weight: 500;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  background-color: white;
  background-repeat: no-repeat;
  background-position: 12px 11px;
  margin-top: 1rem;
}

.login-with-google-btn {
  background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTcuNiA5LjJsLS4xLTEuOEg5djMuNGg0LjhDMTMuNiAxMiAxMyAxMyAxMiAxMy42djIuMmgzYTguOCA4LjggMCAwIDAgMi42LTYuNnoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGQ9Ik05IDE4YzIuNCAwIDQuNS0uOCA2LTIuMmwtMy0yLjJhNS40IDUuNCAwIDAgMS04LTIuOUgxVjEzYTkgOSAwIDAgMCA4IDV6IiBmaWxsPSIjMzRBODUzIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNNCAxMC43YTUuNCA1LjQgMCAwIDEgMC0zLjRWNUgxYTkgOSAwIDAgMCAwIDhsMy0yLjN6IiBmaWxsPSIjRkJCQzA1IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNOSAzLjZjMS4zIDAgMi41LjQgMy40IDEuM0wxNSAyLjNBOSA5IDAgMCAwIDEgNWwzIDIuNGE1LjQgNS40IDAgMCAxIDUtMy43eiIgZmlsbD0iI0VBNDMzNSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZD0iTTAgMGgxOHYxOEgweiIvPjwvZz48L3N2Zz4=);
}

.login-with-google-btn:hover {
  cursor: pointer;
  box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.04), 0 2px 4px rgba(0, 0, 0, 0.25);
}

.login-with-google-btn:active {
  background-color: #eeeeee;
}


.login-with-google-btn:focus {
  outline: none;
  box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.04), 0 2px 4px rgba(0, 0, 0, 0.25),
    0 0 0 3px #c8dafc;
}

.login-with-google-btn:disabled {
  filter: grayscale(100%);
  background-color: #ebebeb;
  box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.04), 0 1px 1px rgba(0, 0, 0, 0.25);
  cursor: not-allowed;
}
</style>
