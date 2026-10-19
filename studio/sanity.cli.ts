import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'f4el6clm',
    dataset: 'production'
  },
  studioHost: 'omraa-alqomash',
  deployment: {
    appId: 'x6w2wx86329rvt64wq3omed6',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
})
