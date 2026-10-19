import { AboutHighlights } from '../components/about/AboutHighlights'
import { AboutIntro } from '../components/about/AboutIntro'
import { AboutStory } from '../components/about/AboutStory'
import { Quality } from '../components/about/Quality'
import { VisionMission } from '../components/about/VisionMission'
import { PageLayout } from '../components/layout/PageLayout'

export function About() {
  return (
    <PageLayout>
      <AboutIntro />
      <AboutHighlights />
      <AboutStory />
      <Quality />
      <VisionMission />
    </PageLayout>
  )
}
