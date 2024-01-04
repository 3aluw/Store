<script setup>
const { auth } = useDeskree();
const router = useRouter();
auth.logout();
onMounted(() => {
  window.location = "/";
});
</script>
