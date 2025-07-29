import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Brain, ArrowLeft, Users, ThumbsUp, ThumbsDown, Mail, Eye, Filter } from "lucide-react";
import { Link } from "wouter";
import { SiLinkedin } from "react-icons/si";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Candidate } from "@shared/schema";

export default function Dashboard() {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [activeFilter, setActiveFilter] = useState<"all" | "linkedin" | "indeed" | "ai">("all");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: candidates, isLoading } = useQuery<Candidate[]>({
    queryKey: ["/api/candidates", { 
      source: activeFilter === "linkedin" || activeFilter === "indeed" ? activeFilter : undefined,
      aiRecommended: activeFilter === "ai" ? true : undefined
    }],
  });

  const { data: stats } = useQuery<{
    totalCandidates: number;
    aiRecommended: number;
    linkedin: number;
    indeed: number;
    shortlisted: number;
    contacted: number;
  }>({
    queryKey: ["/api/stats"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ candidateId, status }: { candidateId: string; status: string }) =>
      apiRequest("PATCH", `/api/candidates/${candidateId}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/candidates"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Success",
        description: "Candidate status updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update candidate status",
        variant: "destructive",
      });
    },
  });

  const createActionMutation = useMutation({
    mutationFn: (action: { userId: string; candidateId: string; action: string }) =>
      apiRequest("POST", "/api/user-actions", action),
  });

  const handleAction = (candidateId: string, action: string) => {
    // Update candidate status
    const statusMap: Record<string, string> = {
      shortlist: "shortlisted",
      reject: "rejected", 
      contact: "contacted"
    };

    if (statusMap[action]) {
      updateStatusMutation.mutate({ candidateId, status: statusMap[action] });
    }

    // Log user action
    createActionMutation.mutate({
      userId: "demo-user", // In a real app, this would come from auth context
      candidateId,
      action
    });
  };

  const handleViewCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    createActionMutation.mutate({
      userId: "demo-user",
      candidateId: candidate.id,
      action: "view"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "shortlisted": return "bg-ai-green/20 text-ai-green";
      case "rejected": return "bg-red-500/20 text-red-400";
      case "contacted": return "bg-ai-blue/20 text-ai-blue";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const filteredCandidates = candidates || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ai-dark flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-ai-blue border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ai-dark text-white">
      {/* Header */}
      <div className="glass-effect border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-ai-blue to-ai-purple rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Candidate Dashboard</h1>
                  <p className="text-sm text-gray-400">Manage your recruitment pipeline</p>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="glass-effect">
              <div className="w-2 h-2 bg-ai-green rounded-full mr-2 animate-pulse"></div>
              AI Active
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-effect border-gray-700/50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-ai-blue/20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-ai-blue" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Candidates</p>
                  <p className="text-2xl font-bold text-white">{stats?.totalCandidates || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-gray-700/50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-ai-purple/20 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-ai-purple" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">AI Recommended</p>
                  <p className="text-2xl font-bold text-white">{stats?.aiRecommended || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-gray-700/50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-ai-green/20 rounded-lg flex items-center justify-center">
                  <ThumbsUp className="w-6 h-6 text-ai-green" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Shortlisted</p>
                  <p className="text-2xl font-bold text-white">{stats?.shortlisted || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-gray-700/50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Contacted</p>
                  <p className="text-2xl font-bold text-white">{stats?.contacted || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="glass-effect border-gray-700/50 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <Filter className="w-5 h-5 text-gray-400" />
              <div className="flex space-x-2">
                {[
                  { key: "all", label: "All Candidates" },
                  { key: "ai", label: "AI Recommended" },
                  { key: "linkedin", label: "LinkedIn" },
                  { key: "indeed", label: "Indeed" }
                ].map((filter) => (
                  <Button
                    key={filter.key}
                    variant={activeFilter === filter.key ? "default" : "secondary"}
                    size="sm"
                    onClick={() => setActiveFilter(filter.key as any)}
                    className={activeFilter === filter.key ? 
                      "bg-gradient-to-r from-ai-blue to-ai-purple" : 
                      "glass-effect hover:bg-white/10"
                    }
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Candidates List */}
        <Card className="glass-effect border-gray-700/50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Candidates ({filteredCandidates.length})</span>
              {activeFilter === "ai" && (
                <Badge className="bg-ai-purple/20 text-ai-purple">
                  <Brain className="w-3 h-3 mr-1" />
                  AI Filtered
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredCandidates.length ? (
                filteredCandidates.map((candidate) => (
                  <div key={candidate.id} className="flex items-center justify-between p-4 glass-effect rounded-lg hover:bg-white/5 transition-all">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-ai-blue to-ai-purple rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {candidate.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-white">{candidate.name}</p>
                          {candidate.source === "linkedin" && (
                            <SiLinkedin className="w-4 h-4 text-blue-500" />
                          )}
                          {candidate.isAiRecommended && (
                            <Badge className="bg-ai-purple/20 text-ai-purple text-xs">
                              <Brain className="w-3 h-3 mr-1" />
                              AI
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-400">{candidate.email}</p>
                        <p className="text-xs text-gray-500">
                          {candidate.skills?.slice(0, 3).join(", ")}
                          {candidate.aiScore && (
                            <span className="ml-2 text-ai-blue font-mono">
                              Score: {candidate.aiScore}%
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(candidate.status!)}>
                        {candidate.status}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleViewCandidate(candidate)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {candidate.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleAction(candidate.id, "shortlist")}
                            className="text-ai-green hover:bg-ai-green/20"
                            disabled={updateStatusMutation.isPending}
                          >
                            <ThumbsUp className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleAction(candidate.id, "reject")}
                            className="text-red-400 hover:bg-red-500/20"
                            disabled={updateStatusMutation.isPending}
                          >
                            <ThumbsDown className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      {candidate.status === "shortlisted" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleAction(candidate.id, "contact")}
                          className="text-ai-blue hover:bg-ai-blue/20"
                          disabled={updateStatusMutation.isPending}
                        >
                          <Mail className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No candidates found for the selected filter</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Candidate Detail Modal */}
      <Dialog open={!!selectedCandidate} onOpenChange={() => setSelectedCandidate(null)}>
        <DialogContent className="glass-effect border-gray-700/50 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-ai-blue to-ai-purple rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {selectedCandidate?.name.charAt(0)}
                </span>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span>{selectedCandidate?.name}</span>
                  {selectedCandidate?.isAiRecommended && (
                    <Badge className="bg-ai-purple/20 text-ai-purple">
                      <Brain className="w-3 h-3 mr-1" />
                      AI Recommended
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-400 font-normal">{selectedCandidate?.email}</p>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {selectedCandidate && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2 text-white">Summary</h3>
                <p className="text-gray-300 text-sm">
                  {selectedCandidate.summary || "No summary available."}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2 text-white">Experience</h3>
                <p className="text-gray-300 text-sm">
                  {selectedCandidate.experience || "No experience information available."}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2 text-white">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCandidate.skills?.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="bg-ai-gray text-gray-300">
                      {skill}
                    </Badge>
                  )) || <span className="text-gray-400 text-sm">No skills listed.</span>}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Badge variant="outline" className="border-gray-600 text-gray-300">
                    {selectedCandidate.source}
                  </Badge>
                  <Badge className={getStatusColor(selectedCandidate.status!)}>
                    {selectedCandidate.status}
                  </Badge>
                  {selectedCandidate.aiScore && (
                    <span className="text-sm text-ai-blue font-mono">
                      AI Score: {selectedCandidate.aiScore}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
