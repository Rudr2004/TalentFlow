import { Link } from "wouter";
import { Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiX, SiLinkedin, SiGithub } from "react-icons/si";

export function Footer() {
  const footerSections = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "#pricing" },
        { label: "API", href: "#" },
        { label: "Integrations", href: "#" },
      ]
    },
    {
      title: "Company", 
      links: [
        { label: "About", href: "#" },
        { label: "Blog", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Contact", href: "#" },
      ]
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", href: "#" },
        { label: "Documentation", href: "#" },
        { label: "Admin Portal", href: "/admin" },
        { label: "Status", href: "#" },
      ]
    }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId.substring(1));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-ai-darker border-t border-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-ai-blue to-ai-purple rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-ai-blue to-ai-purple bg-clip-text text-transparent">
                AIRecruit
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              The future of intelligent recruitment is here. Transform your hiring process with AI.
            </p>
            <div className="flex space-x-3">
              <Button size="sm" variant="secondary" className="w-8 h-8 p-0 bg-gray-700 hover:bg-ai-blue">
                <SiX className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="secondary" className="w-8 h-8 p-0 bg-gray-700 hover:bg-ai-blue">
                <SiLinkedin className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="secondary" className="w-8 h-8 p-0 bg-gray-700 hover:bg-ai-blue">
                <SiGithub className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold mb-4 text-white">{section.title}</h3>
              <div className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  link.href.startsWith('#') ? (
                    <button
                      key={linkIndex}
                      onClick={() => scrollToSection(link.href)}
                      className="block text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </button>
                  ) : (
                    <Link
                      key={linkIndex}
                      href={link.href}
                      className="block text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  )
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2024 AIRecruit. All rights reserved.</p>
          <div className="flex space-x-6 text-sm text-gray-400 mt-4 sm:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
