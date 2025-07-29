import { Card, CardContent } from "@/components/ui/card";
import { Search, Star, Zap } from "lucide-react";

export function DemoSection() {
  const demoFeatures = [
    {
      icon: <Search className="text-white" />,
      title: "Smart Candidate Discovery",
      description: "AI scans thousands of profiles to find candidates matching your exact requirements",
      metric: "10,000+ profiles analyzed per minute",
      color: "from-ai-blue to-ai-purple"
    },
    {
      icon: <Star className="text-white" />,
      title: "Intelligent Scoring",
      description: "Machine learning models rank candidates based on success patterns",
      metric: "95% accuracy in matching",
      color: "from-ai-purple to-purple-600"
    },
    {
      icon: <Zap className="text-white" />,
      title: "Real-time Notifications",
      description: "Get instant alerts when perfect candidates become available",
      metric: "Sub-second alert delivery",
      color: "from-ai-green to-green-600"
    }
  ];

  return (
    <section id="demo" className="py-20 bg-ai-dark relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">See AI in Action</h2>
          <p className="text-xl text-gray-400">Experience how our AI transforms candidate management</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            {demoFeatures.map((feature, index) => (
              <Card key={index} className="glass-effect border-gray-700/50 hover:bg-white/10 transition-all cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2 text-white">{feature.title}</h3>
                      <p className="text-gray-400 text-sm mb-3">{feature.description}</p>
                      <div className="text-xs font-mono" style={{color: feature.color.includes('ai-blue') ? 'var(--ai-blue)' : feature.color.includes('ai-purple') ? 'var(--ai-purple)' : 'var(--ai-green)'}}>
                        • {feature.metric}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
              alt="Artificial intelligence visualization with neural networks and data processing" 
              className="w-full h-80 object-cover rounded-2xl" 
            />
            
            {/* Floating metrics */}
            <div className="absolute top-4 right-4 glass-effect rounded-lg p-3 animate-pulse-glow">
              <div className="text-xs text-gray-300 mb-1">AI Confidence</div>
              <div className="text-lg font-bold text-ai-blue">98.7%</div>
            </div>
            
            <div className="absolute bottom-4 left-4 glass-effect rounded-lg p-3 animate-float">
              <div className="text-xs text-gray-300 mb-1">Processing Speed</div>
              <div className="text-lg font-bold text-ai-purple">2.4ms</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
