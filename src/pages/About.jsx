import React from 'react'

export default function About() {
  return (
    <div className="w-full">
      <div className="container w-[1300px] mx-auto">
        <div className="pt-16">
          
          <div className="flex gap-11 pl-4 mb-8">
            <div>
              <h1 id="team-name" className="text-[48px] font-bold text-primary">
                Tam Cultural and Sports Club
              </h1>
              <div className="w-[790px] mt-6">
                <p id="team-descriptions" className="text-[32px] font-normal text-secondary h-[790px] text-ellipsis">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Egestas purus viverra accumsan in nisl nisi. Arcu cursus vitae congue mauris rhoncus aenean vel elit scelerisque. In egestas erat imperdiet sed euismod nisi porta lorem mollis. Morbi tristique senectus et netus. Mattis pellentesque id nibh tortor id aliquet lectus proin. Sapien faucibus et molestie ac feugiat sed lectus vestibulum. Ullamcorper velit sed ullamcorper morbi tincidunt ornare massa eget. Dictum varius duis at consectetur lorem. Nisi vitae suscipit tellus mauris a diam maecenas sed enim. Velit ut tortor pretium viverra suspendisse potenti nullam. Et molestie ac feugiat sed lectus. Non nisi est sit amet facilisis magna. Dignissim diam quis enim lobortis...
                </p>
              </div>
            </div>
            
            <div className="w-[450px] h-[891px]">
              <img 
                src="/images/logos/AboutLogo.png" 
                alt="About Logo" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="mt-32">
            <h2 id="team-honors" className="text-[48px] font-bold text-primary">
              Important Honors
            </h2>
            
            <div className="flex mt-6">
              <div className="w-[1px] bg-quaternary"></div>
              
              <div className="ml-6">
                {[...Array(12)].map((_, index) => (
                  <p key={index} className="text-[32px] font-medium text-primary-shade-600 mb-4">
                    Premier League Championship 2008/09
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
