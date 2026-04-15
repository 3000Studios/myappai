import {
  AlertTriangle,
  CheckCircle2,
  FileCode,
  GitBranch,
  Loader2,
  Rocket,
  TerminalSquare,
  XCircle,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
  fetchRepoDetails,
  getDeploymentStatus,
  getHeadStatus,
} from '../../lib/webeditor/githubService';
import { useUser } from '../../providers/webeditor/UserContext';

interface RepoStatusProps {
  lastUpdate: number;
}

export const RepoStatus: React.FC<RepoStatusProps> = ({ lastUpdate }) => {
  const { config } = useUser();
  const [details, setDetails] = useState<any>(null);
  const [deployment, setDeployment] = useState<any>(null);
  const [head, setHead] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = async () => {
    if (!config) return;
    setIsRefreshing(true);
    try {
      const { data } = await fetchRepoDetails(config);
      setDetails(data);

      const deployStatus = await getDeploymentStatus(config);
      setDeployment(deployStatus);

      const headStatus = await getHeadStatus(config);
      setHead(headStatus);

      setError('');
    } catch (e: any) {
      setError('Failed to fetch repo details.');
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
    // Poll every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [config, lastUpdate]);

  if (!config) {
    return <div className="p-4 text-xs text-gray-500 font-mono">No repository connected.</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-xs text-red-600 font-bold flex items-center gap-2">
        <AlertTriangle className="h-3 w-3" /> {error}
      </div>
    );
  }

  if (!details) {
    return (
      <div className="p-4 text-xs text-gray-600 animate-pulse font-mono">
        Scanning repository...
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 relative animate-fade-in">
      {isRefreshing && (
        <div className="absolute top-2 right-2 text-gold animate-spin">
          <Loader2 className="h-3 w-3" />
        </div>
      )}

      <div className="space-y-1 border-b border-gray-300 pb-2">
        <h3 className="text-base font-bold text-gray-900 tracking-tight">{details.name}</h3>
        <p className="text-[10px] text-gray-600 truncate">
          {details.description || 'No description'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded bg-white border border-gray-200 p-2 shadow-sm">
          <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-1 uppercase tracking-wide">
            <GitBranch className="h-3 w-3" /> Branch
          </div>
          <div className="text-xs font-bold text-gray-800 font-mono">{details.default_branch}</div>
        </div>
        <div className="rounded bg-white border border-gray-200 p-2 shadow-sm">
          <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-1 uppercase tracking-wide">
            <FileCode className="h-3 w-3" /> Lang
          </div>
          <div className="text-xs font-bold text-gold-dark font-mono">
            {details.language || 'N/A'}
          </div>
        </div>
      </div>

      {/* Simulated Git Status Terminal */}
      {head && (
        <div className="rounded bg-gray-900 border border-gray-700 p-2 shadow-sm text-[10px] font-mono leading-tight">
          <div className="flex items-center gap-2 border-b border-gray-700 pb-1 mb-1 text-gray-400">
            <TerminalSquare className="h-3 w-3" />
            <span className="uppercase tracking-widest">git status</span>
          </div>
          <div className="text-green-400">On branch {head.branch}</div>
          <div className="text-gray-300">
            Your branch is up to date with 'origin/{head.branch}'.
          </div>
          <div className="text-gray-300 mt-1">
            Latest commit <span className="text-yellow-500">{head.sha}</span>
          </div>
          <div className="text-gray-500 italic pl-2 border-l-2 border-gray-700 my-1">
            "{head.message}"
          </div>
          <div className="text-gray-300 mt-2">nothing to commit, working tree clean</div>
        </div>
      )}

      {/* Deployment Status */}
      <div
        className={`rounded border p-2 shadow-sm ${
          deployment?.state === 'success'
            ? 'bg-green-50 border-green-200'
            : deployment?.state === 'failure'
              ? 'bg-red-50 border-red-200'
              : 'bg-gray-50 border-gray-200'
        }`}
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1 text-[10px] text-gray-500 uppercase tracking-wide">
            <Rocket className="h-3 w-3" /> Vercel Deployment
          </div>
          {deployment?.state === 'success' ? (
            <CheckCircle2 className="h-3 w-3 text-green-600" />
          ) : deployment?.state === 'failure' ? (
            <XCircle className="h-3 w-3 text-red-600" />
          ) : deployment?.state === 'pending' ? (
            <Loader2 className="h-3 w-3 animate-spin text-blue-600" />
          ) : (
            <span className="text-[10px] text-gray-400">Inactive</span>
          )}
        </div>
        <div className="text-xs font-bold font-mono truncate">
          {deployment ? deployment.description || deployment.state : 'No deployments'}
        </div>
        {deployment?.updated_at && (
          <div className="text-[9px] text-gray-400 mt-1 text-right">
            {new Date(deployment.updated_at).toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
};

