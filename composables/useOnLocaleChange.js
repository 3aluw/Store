

const onLocaleChangeCallbacks = ref([]);
let isWatchInitialized = false

export default function (callback) {
    const { locale, localeProperties } = useI18n();
    if (!isWatchInitialized) {
        watch(locale, async() => {
      for (const callback of onLocaleChangeCallbacks.value) {
        await callback(localeProperties.value)
      }
        })
        isWatchInitialized = true
    }
    onLocaleChangeCallbacks.value.push(callback);
}