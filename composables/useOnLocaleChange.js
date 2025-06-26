

const onLocaleChangeCallbacks = ref([]);
let isWatchInitialized = false

export default function (callback) {
    const { locale, localeProperties } = useI18n();
    if (!isWatchInitialized) {
        watch(locale, () => {
            onLocaleChangeCallbacks.value.forEach(callback => {
                callback(localeProperties.value);
            })
        })
        isWatchInitialized = true
    }
    onLocaleChangeCallbacks.value.push(callback);
}