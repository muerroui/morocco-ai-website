import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '5vfa1g0e',
    dataset: 'production'
  },
  deployment: {
    appId: 'zjivb9uwsvbm8ycm41wkdzhn',
    autoUpdates: true,
  }
})
