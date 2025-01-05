export type AgentRanking = {
  agentId: string;
  name: string;
  photo?: string;
  username: string;
  areas: string[];
  followerCount: number;
  rank: number;
};

export type AreaRanking = {
  area: string;
  agents: AgentRanking[];
};