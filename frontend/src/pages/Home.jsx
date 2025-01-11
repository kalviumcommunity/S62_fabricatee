import React from 'react'
import logo from '../assets/logo.png'
import InfoCard from '../components/InfoCard'

const processData = [
  {
    imageUrl: "https://via.placeholder.com/150",
    title: "Browse & Select",
    description: <span>Explore a wide range of designs and fabrics. <br/> Choose your favorite combination to customize your look.</span>
  },
  {
    imageUrl: "https://via.placeholder.com/150",
    title: "Provide Measurements",
    description: <span>Enter your measurements or modify standard ones.<br/> Option to book an appointment for an expert to take your measurements at your location.</span>
  },
  {
    imageUrl: "https://via.placeholder.com/150",
    title: "Custom Tailoring",
    description: <span>Skilled tailors craft your outfit with precision and high-quality stitching.</span>
  },
  {
    imageUrl: "https://via.placeholder.com/150",
    title: "Fast Delivery",
    description: <span>Receive your custom-tailored clothes quickly, delivered to your doorstep.</span>
  },
]

function Home() {
  return (
    <div className='w-full'>
      <section className='min-h-[95vh] md:min-h-[95vh] flex items-center'>
        <div className='w-full flex bg-white justify-center flex-col align-middle'>
          <img src={logo} alt="logo" className="h-3/4 w-5/6 md:h-2/6 md:w-2/6 self-center"/>
        </div>
      </section>
      <section className='w-full flex flex-row flex-wrap justify-around bg-light py-8'>
          {processData.map((card, index)=>{
            return(
            <InfoCard
              key={index}
              title={card.title}
              imageUrl={card.imageUrl}
              description={card.description}
            />);
          })}
      </section>
    </div>
  )
}

export default Home
