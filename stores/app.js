export const useAppStore = defineStore('appStore', () => {
  const config = useRuntimeConfig();
  const sponsorship = ref();
  const about = ref();
  const data = ref();

  const getData = () => {
    const url = `${config.public.apiDomain}${config.public.apiPages}`;

    return $fetch(url).then(response => {
      sponsorship.value = response.sponsorship;
      about.value = response.about;
      data.value = response.data;
    }).catch(error => console.log(error));
  };

  return {
    sponsorship,
    about,
    data,

    getData,
  };
});
