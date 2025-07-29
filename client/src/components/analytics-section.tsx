import { TrendingUp, Users, Target } from "lucide-react";

export function AnalyticsSection() {
  const features = [
    {
      icon: <TrendingUp className="text-ai-blue" />,
      title: "Success Rate Tracking",
      description: "Monitor hiring success rates and optimize your process"
    },
    {
      icon: <Users className="text-ai-purple" />,
      title: "Team Performance", 
      description: "Track recruiter performance and candidate interactions"
    },
    {
      icon: <Target className="text-ai-green" />,
      title: "AI Accuracy Metrics",
      description: "Continuous improvement of AI matching algorithms"
    }
  ];

  const stats = [
    { value: "95%", label: "Match Accuracy", color: "text-ai-blue" },
    { value: "60%", label: "Time Saved", color: "text-ai-purple" },
    { value: "3x", label: "Faster Hiring", color: "text-ai-green" }
  ];

  return (
    <section className="py-20 bg-ai-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">
              Data-Driven <span className="text-ai-blue">Insights</span>
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Make informed hiring decisions with comprehensive analytics and AI-powered recommendations.
            </p>
            
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-ai-blue/20 rounded-lg flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{feature.title}</h3>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
              alt="Futuristic office environment with digital analytics displays and data visualization" 
              className="w-full h-80 object-cover rounded-2xl" 
            />
            
            {/* Stats overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-ai-dark/80 via-transparent to-transparent rounded-2xl"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                {stats.map((stat, index) => (
                  <div key={index} className="glass-effect rounded-lg p-3">
                    <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                    <div className="text-xs text-gray-300">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
