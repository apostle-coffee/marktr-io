import { getProfileImage } from "@/config/profileImages";
import svgPaths from "@/imports/svg-dy16vubapd";

interface Testimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  image: string;
  color: string;
}

export function TestimonialsRow() {
  const testimonials: Testimonial[] = [
    {
      name: "Charlotte Pegram",
      role: "Founder",
      company: "LexKin",
      quote: "ICP Generator is a wonderfully easy tool to use, with a clear and intuitive interface. The pricing is extremely competitive and the customer service second to none!",
      image: getProfileImage("ld1"),
      color: "#FFD336",
    },
    {
      name: "Adrian Taylor",
      role: "Project Manager",
      company: "Bullfinch Digital",
      quote: "We chose ICP Generator based on their highly competitive pricing and incredible interface. Not only that, their team gave 110% in helping craft the solution for our project.",
      image: getProfileImage("adrian"),
      color: "#FF9922",
    },
    {
      name: "Belinda Singh",
      role: "Head of Content",
      company: "AdBard",
      quote: "We've been working with ICP Generator for some time now. It's become the foundation of client onboarding and the creation of targeted marketing strategies.",
      image: getProfileImage("belinda"),
      color: "#96CBB6",
    },
  ];

  return (
    <section className="bg-background py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="relative opacity-0 animate-fade-in-up" style={{ animationDelay: `${index * 0.15}s` }}>
              {/* Profile Circle */}
              <div className="absolute left-1/2 -translate-x-1/2 -top-12 w-24 h-24 z-10">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 146 145" fill="none">
                  <path 
                    d={svgPaths.pef38d80} 
                    fill={testimonial.color} 
                    stroke="black" 
                    strokeWidth="1"
                  />
                </svg>
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="absolute inset-0 w-full h-full object-cover rounded-full p-1.5"
                />
              </div>

              {/* Testimonial Container */}
              <div className="bg-transparent border border-black rounded-design p-6 pt-16 text-center h-full flex flex-col">
                <h3 className="font-['Fraunces'] mb-2 text-[18px]">{testimonial.name}</h3>
                <p className="font-['Inter'] text-foreground/80 mb-4 text-[15px] flex-grow">
                  "{testimonial.quote}"
                </p>
                <p className="font-['Inter'] text-sm text-foreground/60 text-[14px]">
                  {testimonial.role}, {testimonial.company}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
