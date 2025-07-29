import { Upload, Brain, List, Handshake } from "lucide-react";

export function WorkflowSection() {
  const steps = [
    {
      icon: <Upload className="text-2xl text-white" />,
      title: "1. Upload Job Requirements",
      description: "Define your ideal candidate profile and requirements",
      color: "from-ai-blue to-ai-purple"
    },
    {
      icon: <Brain className="text-2xl text-white" />,
      title: "2. AI Analysis", 
      description: "Our AI scans LinkedIn and Indeed for matching candidates",
      color: "from-ai-purple to-purple-600"
    },
    {
      icon: <List className="text-2xl text-white" />,
      title: "3. Review & Shortlist",
      description: "Review AI-ranked candidates and make shortlist decisions",
      color: "from-purple-600 to-ai-green"
    },
    {
      icon: <Handshake className="text-2xl text-white" />,
      title: "4. Connect & Hire",
      description: "Directly contact candidates and manage the hiring process",
      color: "from-ai-green to-green-600"
    }
  ];

  return (
    <section className="py-20 bg-ai-darker">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Streamlined Workflow</h2>
          <p className="text-xl text-gray-400">From discovery to hiring in just a few clicks</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center group">
              <div className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                {step.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">{step.title}</h3>
              <p className="text-gray-400 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
