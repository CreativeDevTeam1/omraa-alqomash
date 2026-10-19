import { Hero } from '../components/home/Hero'
import { LoadingScreen } from '../components/home/LoadingScreen'
import { Manufacture } from '../components/home/Manufacture'
import { ProductsGallery } from '../components/home/ProductsGallery'
import { PageLayout } from '../components/layout/PageLayout'

export function Home() {
  return (
    <PageLayout before={<LoadingScreen />}>
      <Hero />
      <ProductsGallery />
      <Manufacture />
    </PageLayout>
  )
}
