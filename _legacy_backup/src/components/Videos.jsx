import VideoSection from './VideoSection'

const Videos = () => {
  return (
    <>
      {/* Primeira seção de vídeo - entre About e Portfolio */}
      <VideoSection
        id="videos-1"
        text="criatividade que transforma ideias em experiências digitais únicas"
        position="top-right"
      />

      {/* Segunda seção de vídeo - entre Portfolio e Contact */}
      <VideoSection
        id="videos-2"
        text="tecnologia com propósito, wordpress que faz a diferença"
        position="bottom-left"
      />
    </>
  )
}

export default Videos
