import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, ArrowLeft, Users, Activity, TrendingUp, Eye } from "lucide-react";
import { Link } from "wouter";
import type { UserAction, Candidate } from "@shared/schema";

export default function Admin() {
  const { data: userActions, isLoading: actionsLoading } = useQuery<UserAction[]>({
    queryKey: ["/api/user-actions"],
  });

  const { data: candidates, isLoading: candidatesLoading } = useQuery<Candidate[]>({
    queryKey: ["/api/candidates"],
  });

  const { data: stats, isLoading: statsLoading } = useQuery<{
    totalCandidates: number;
    aiRecommended: number;
    linkedin: number;
    indeed: number;
    shortlisted: number;
    contacted: number;
  }>({
    queryKey: ["/api/stats"],
  });

  const getActionColor = (action: string) => {
    switch (action) {
      case "shortlist": return "bg-ai-green/20 text-ai-green";
      case "reject": return "bg-red-500/20 text-red-400";
      case "contact": return "bg-ai-blue/20 text-ai-blue";
      case "view": return "bg-ai-purple/20 text-ai-purple";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (actionsLoading || candidatesLoading || statsLoading) {
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
                  <h1 className="text-xl font-bold">Admin Control Center</h1>
                  <p className="text-sm text-gray-400">Monitor and manage your recruitment platform</p>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="glass-effect">
              <div className="w-2 h-2 bg-ai-green rounded-full mr-2 animate-pulse"></div>
              System Online
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
                  <TrendingUp className="w-6 h-6 text-ai-green" />
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
                  <Activity className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Actions Today</p>
                  <p className="text-2xl font-bold text-white">{userActions?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="actions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-400px bg-ai-gray">
            <TabsTrigger value="actions">User Actions</TabsTrigger>
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
          </TabsList>

          <TabsContent value="actions">
            <Card className="glass-effect border-gray-700/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-ai-blue" />
                  <span>Recent User Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userActions?.length ? (
                    userActions.slice(0, 10).map((action) => (
                      <div key={action.id} className="flex items-center justify-between p-4 glass-effect rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-ai-gray rounded-full flex items-center justify-center">
                            <Eye className="w-4 h-4 text-gray-400" />
                          </div>
                          <div>
                            <p className="font-medium text-white">User {action.userId}</p>
                            <p className="text-sm text-gray-400">
                              Performed action on candidate {action.candidateId}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge className={getActionColor(action.action)}>
                            {action.action}
                          </Badge>
                          <span className="text-sm text-gray-400">
                            {formatDate(action.timestamp!)}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-400">
                      <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No user actions recorded yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="candidates">
            <Card className="glass-effect border-gray-700/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-ai-purple" />
                  <span>Candidate Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {candidates?.length ? (
                    candidates.slice(0, 10).map((candidate) => (
                      <div key={candidate.id} className="flex items-center justify-between p-4 glass-effect rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-ai-blue to-ai-purple rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {candidate.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-white">{candidate.name}</p>
                            <p className="text-sm text-gray-400">{candidate.email}</p>
                            <p className="text-xs text-gray-500">
                              {candidate.skills?.slice(0, 3).join(", ")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {candidate.isAiRecommended && (
                            <Badge className="bg-ai-purple/20 text-ai-purple">
                              <Brain className="w-3 h-3 mr-1" />
                              AI Recommended
                            </Badge>
                          )}
                          <Badge variant="outline" className="border-gray-600 text-gray-300">
                            {candidate.source}
                          </Badge>
                          <Badge className={
                            candidate.status === "shortlisted" ? "bg-ai-green/20 text-ai-green" :
                            candidate.status === "rejected" ? "bg-red-500/20 text-red-400" :
                            candidate.status === "contacted" ? "bg-ai-blue/20 text-ai-blue" :
                            "bg-gray-500/20 text-gray-400"
                          }>
                            {candidate.status}
                          </Badge>
                          {candidate.aiScore && (
                            <span className="text-sm text-ai-blue font-mono">
                              {candidate.aiScore}%
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-400">
                      <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No candidates found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
