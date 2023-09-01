import { createClient } from "contentful";
import * as contentful from 'contentful'

export default defineNuxtPlugin((nuxtapp)=>{
    const runtimeConfig  = useRuntimeConfig();
    //I may use contentful.createClient in dev too
    const createClientFunc = process.env.NODE_ENV === 'development' ? createClient : contentful.createClient

    const client = createClientFunc({
        space: runtimeConfig.public.contentfulSpace as string,
        accessToken: runtimeConfig.public.contentfulPublicAccessToken as string,
        
      });
      return{
        provide:{
            contentful : client
        }
      }
})