import { createClient } from "contentful";
import contentful from 'contentful'

export default defineNuxtPlugin((nuxtapp)=>{
    const runtimeConfig  = useRuntimeConfig();
    //I may use contentful.createClient in dev too
    const createClientFunc = process.env.NODE_ENV === 'development' ? createClient : contentful.createClient

    const client = createClientFunc({
        space: runtimeConfig .contentfulSpace,
        accessToken: runtimeConfig.contentfulPublicAccessToken,
      });
      return{
        provide:{
            contentful : client
        }
      }
})