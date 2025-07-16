interface AboutVideoProps {
    videoUrl: string
  }
  
  const AboutVideo = ({ videoUrl }: AboutVideoProps) => {
    const videoId = new URL(videoUrl).searchParams.get("v") || videoUrl.split("youtu.be/")[1]
  
    return (
      <div className="aspect-video w-full">
        <iframe
          className="w-full h-full rounded-xl"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="About Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }
  
  export default AboutVideo
  