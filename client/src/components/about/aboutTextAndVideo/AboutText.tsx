interface AboutTextProps {
    description: string
  }
  
  const AboutText = ({ description }: AboutTextProps) => {
    return (
    <div>
      <h1 className="tracking-wider font-extrabold text-xl text-black"> About Homzystay</h1>
        <div
        className="prose w-full text-justify"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
    )
  }
  
  export default AboutText
  