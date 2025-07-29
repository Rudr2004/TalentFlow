import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Calendar, Phone } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function CTASection() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  
  const contactMutation = useMutation({
    mutationFn: (data: { email: string; message?: string }) =>
      apiRequest("POST", "/api/contact", data),
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "We'll be in touch soon.",
      });
      setEmail("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit form. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      contactMutation.mutate({ email, message: "Free trial signup request" });
    }
  };

  const benefits = [
    "No credit card required",
    "Full access to AI features", 
    "24/7 support included"
  ];

  return (
    <section className="py-20 bg-ai-dark relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-5xl font-bold mb-6">
          Ready to Transform Your{" "}
          <span className="bg-gradient-to-r from-ai-blue to-ai-purple bg-clip-text text-transparent">
            Recruitment?
          </span>
        </h2>
        <p className="text-xl text-gray-400 mb-12">
          Join thousands of companies using AI to find the perfect candidates faster than ever before.
        </p>
        
        <Card className="glass-effect border-gray-700/50 mb-12">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-left">
                <h3 className="text-lg font-semibold mb-4 text-white">Start Your Free Trial</h3>
                <div className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-300">
                      <Check className="w-4 h-4 text-ai-green mr-3 flex-shrink-0" />
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Enter your work email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-ai-gray border-gray-600 text-white placeholder-gray-400 focus:border-ai-blue"
                  required
                />
                <Button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-ai-blue to-ai-purple hover:shadow-lg hover:shadow-ai-blue/25 transition-all"
                  disabled={contactMutation.isPending}
                >
                  {contactMutation.isPending ? "Submitting..." : "Start Free Trial"}
                </Button>
                <p className="text-xs text-gray-400">14-day free trial • Cancel anytime</p>
              </form>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="secondary" className="glass-effect hover:bg-white/10">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Demo
          </Button>
          <Button variant="secondary" className="glass-effect hover:bg-white/10">
            <Phone className="w-4 h-4 mr-2" />
            Talk to Sales
          </Button>
        </div>
      </div>
    </section>
  );
}
