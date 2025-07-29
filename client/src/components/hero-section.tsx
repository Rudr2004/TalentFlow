import { Button } from "@/components/ui/button";
import { Rocket, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function HeroSection() {
  return (
    <section className="pt-32 pb-20 gradient-mesh relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="glass-effect mb-8 px-4 py-2">
            <div className="w-2 h-2 bg-ai-green rounded-full mr-2 animate-pulse"></div>
            AI-Powered Recruitment Platform
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Intelligent<br/>
            <span className="bg-gradient-to-r from-ai-blue via-ai-purple to-ai-blue bg-clip-text text-transparent">
              Candidate
            </span><br/>
            Management
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            Revolutionize your hiring process with AI-driven candidate discovery, automated screening, 
            and intelligent matching from LinkedIn and Indeed.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-ai-blue to-ai-purple hover:shadow-2xl hover:shadow-ai-blue/30 transition-all transform hover:scale-105">
              <Rocket className="w-5 h-5 mr-2" />
              Start Free Trial
            </Button>
            <Button size="lg" variant="secondary" className="glass-effect hover:bg-white/10">
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="relative max-w-5xl mx-auto">
          <div className="glass-effect rounded-2xl p-8 shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
              alt="AI-powered recruitment dashboard interface" 
              className="w-full h-64 object-cover rounded-xl mb-6" 
            />
            
            {/* Floating AI indicators */}
            <div className="absolute top-12 right-12 glass-effect rounded-lg p-3 animate-float">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-ai-green rounded-full animate-pulse"></div>
                <span className="text-sm font-mono">AI Active</span>
              </div>
            </div>
            
            <div className="absolute bottom-12 left-12 glass-effect rounded-lg p-4 animate-float" style={{animationDelay: '1s'}}>
              <div className="text-sm text-gray-300 mb-1">Processing Candidates</div>
              <div className="text-2xl font-bold text-ai-blue">847</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
