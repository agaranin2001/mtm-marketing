import { GUIDES } from '../.vitepress/theme/data/guides'

export default {
  paths() {
    return Object.keys(GUIDES).map(id => ({ params: { id } }))
  },
}
