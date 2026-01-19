import Hero from '../components/Hero'
import Services from '../components/Services'
import VideoSection from '../components/VideoSection'
import About from '../components/About'
import Portfolio from '../components/Portfolio'
import Contact from '../components/Contact'
import { useTexts } from '../hooks/useTexts'

const HomePage = () => {
  const { texts } = useTexts()

  return (
    <main>
      <Hero />
      <Services />
      <VideoSection
        id="videos-1"
        text={texts.videos.video1.text}
        position="top-right"
        videoSrc="/videos/video-1.mp4"
      />
      <About />
      <Portfolio />
      <VideoSection
        id="videos-2"
        text={texts.videos.video2.text}
        position="bottom-left"
        videoSrc="/videos/video-2.mp4"
      />
      <Contact />
    </main>
  )
}

export default HomePage
