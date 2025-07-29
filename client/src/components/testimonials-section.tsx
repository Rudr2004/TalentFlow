import { Card, CardContent } from "@/components/ui/card";

export function TestimonialsSection() {
  const testimonials = [
    {
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      quote: "AIRecruit reduced our time-to-hire by 65% and improved candidate quality significantly. The AI recommendations are incredibly accurate.",
      name: "Sarah Chen",
      title: "VP of Talent, TechCorp",
      metric: "65% faster hiring",
      metricColor: "text-ai-blue"
    },
    {
      image: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      quote: "The LinkedIn and Indeed integration is seamless. We've hired 20+ engineers through AIRecruit with a 95% success rate.",
      name: "Marcus Rodriguez", 
      title: "Head of Recruitment, ScaleUp Inc",
      metric: "95% success rate",
      metricColor: "text-ai-purple"
    },
    {
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      quote: "The AI insights helped us identify passive candidates we would have never found. Game-changing for our recruitment strategy.",
      name: "Emily Thompson",
      title: "Talent Director, InnovateAI", 
      metric: "300% more candidates",
      metricColor: "text-ai-green"
    }
  ];

  return (
    <section className="py-20 bg-ai-darker">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Trusted by Industry Leaders</h2>
          <p className="text-xl text-gray-400">See how companies are transforming their recruitment</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="glass-effect border-gray-700/50">
              <CardContent className="p-8">
                <img 
                  src={testimonial.image}
                  alt={`${testimonial.name} workspace`}
                  className="w-16 h-16 rounded-full object-cover mb-4" 
                />
                <p className="text-gray-300 mb-6">"{testimonial.quote}"</p>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">{testimonial.title}</div>
                </div>
                <div className="mt-4 flex items-center space-x-2">
                  <span className={`text-sm font-mono ${testimonial.metricColor}`}>
                    {testimonial.metric}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
