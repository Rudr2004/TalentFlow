import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import { SiLinkedin } from "react-icons/si";
import { Brain, Shield } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: <SiLinkedin className="text-2xl text-white" />,
      title: "LinkedIn Integration",
      description: "Seamlessly connect and manage LinkedIn candidates with advanced filtering and AI-powered recommendations.",
      color: "from-blue-500 to-blue-600",
      items: [
        "Smart candidate filtering",
        "Automated shortlisting", 
        "Real-time sync"
      ]
    },
    {
      icon: <Brain className="text-2xl text-white" />,
      title: "AI-Powered Indeed",
      description: "Leverage AI to automatically label and rank Indeed candidates based on job requirements and success patterns.",
      color: "from-ai-purple to-purple-600",
      items: [
        "AI candidate scoring",
        "Automated summaries",
        "Smart recommendations"
      ]
    },
    {
      icon: <Shield className="text-2xl text-white" />,
      title: "Admin Control Center",
      description: "Comprehensive admin panel for monitoring user actions, candidate interactions, and system analytics.",
      color: "from-ai-green to-green-600",
      items: [
        "Activity monitoring",
        "User management",
        "Analytics dashboard"
      ]
    }
  ];

  return (
    <section id="features" className="py-20 bg-ai-darker relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Powered by <span className="text-ai-blue">Artificial Intelligence</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Advanced AI algorithms analyze millions of profiles to find your perfect candidates
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="glass-effect border-gray-700/50 hover:bg-white/10 transition-all group cursor-pointer">
              <CardContent className="p-8">
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">{feature.title}</h3>
                <p className="text-gray-400 mb-6">{feature.description}</p>
                <div className="space-y-2">
                  {feature.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center text-sm text-gray-300">
                      <Check className="w-4 h-4 text-ai-green mr-2 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
