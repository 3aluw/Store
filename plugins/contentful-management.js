import * as contentful from 'contentful-management';

export default defineNuxtPlugin(() => {

    const runtimeConfig  = useRuntimeConfig();

  
  const scopedPlainClient = contentful.createClient(
    {
      accessToken: runtimeConfig.public.contentfulCMAccessToken,
    },
    {
      type: 'plain',
      defaults: {
        spaceId:  runtimeConfig.public.contentfulSpace,
        environmentId: 'master',
      },
    }
  );

  return {
    provide: {
      contentfulManager: scopedPlainClient,
    },
  };
});
