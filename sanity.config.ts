import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './src/sanity/schemas'

export default defineConfig({
  name: 'morocco-ai',
  title: 'Morocco.AI',

  projectId: '5vfa1g0e',
  dataset: 'production',

  plugins: [structureTool()],

  schema: {
    types: schemaTypes,
  },
})
