import { flattenLessons, GUIDES } from '../../.vitepress/theme/data/guides'

export default {
  paths() {
    return Object.values(GUIDES).flatMap(guide =>
      flattenLessons(guide).map(lesson => ({
        params: { id: guide.id, lesson: lesson.id },
      })),
    )
  },
}
