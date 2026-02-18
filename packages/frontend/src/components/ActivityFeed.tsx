import React, { useEffect, useState } from "react";
import { getEvents, queryEvents } from "../services/api";

const ActivityFeed: React.FC = () => {
  const [liveEvents, setLiveEvents] = useState<any[]>([]);
  const [queryResults, setQueryResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showQueryForm, setShowQueryForm] = useState(false);

  const [queryParams, setQueryParams] = useState({
    address: "0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0",
    eventName: "Transfer",
    abi: '["event Transfer(address indexed from, address indexed to, uint256 value)"]',
    fromBlock: "-100",
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        if (Array.isArray(data)) {
          setLiveEvents(data);
        }
      } catch (err) {
        console.error("Failed to fetch live events", err);
      }
    };

    fetchEvents();
    const interval = setInterval(fetchEvents, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    try {
      const data = await queryEvents({
        ...queryParams,
        fromBlock: isNaN(Number(queryParams.fromBlock)) ? queryParams.fromBlock : Number(queryParams.fromBlock),
      });
      setQueryResults(data);
    } catch (err) {
      console.error("Query failed", err);
      alert("Query failed. Check console for details.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#1e293b]/70 p-8 shadow-2xl backdrop-blur-xl md:col-span-2">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="bg-gradient-to-r from-[#818cf8] to-[#c084fc] bg-clip-text text-xl font-bold text-transparent">
          {showQueryForm ? "Historical Event Query" : "Live Network Activity (USDT Transfers)"}
        </h3>
        <button
          onClick={() => setShowQueryForm(!showQueryForm)}
          className="cursor-pointer rounded-lg border border-[#818cf8]/50 px-4 py-1 text-xs font-semibold text-[#818cf8] transition-all hover:bg-[#818cf8]/10"
        >
          {showQueryForm ? "Show Live Feed" : "Custom Query"}
        </button>
      </div>

      {showQueryForm ? (
        <div className="mb-8 rounded-xl border border-white/5 bg-black/20 p-6">
          <form onSubmit={handleQuery} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="text-xs text-slate-400">Contract Address</label>
              <input
                type="text"
                value={queryParams.address}
                onChange={(e) => setQueryParams({ ...queryParams, address: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-[#0f172a]/50 px-3 py-2 text-sm text-white focus:border-[#6366f1] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400">Event Name</label>
              <input
                type="text"
                value={queryParams.eventName}
                onChange={(e) => setQueryParams({ ...queryParams, eventName: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-[#0f172a]/50 px-3 py-2 text-sm text-white focus:border-[#6366f1] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400">From Block (e.g. -100 or number)</label>
              <input
                type="text"
                value={queryParams.fromBlock}
                onChange={(e) => setQueryParams({ ...queryParams, fromBlock: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-[#0f172a]/50 px-3 py-2 text-sm text-white focus:border-[#6366f1] focus:outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-slate-400">Event ABI (Array)</label>
              <input
                type="text"
                value={queryParams.abi}
                onChange={(e) => setQueryParams({ ...queryParams, abi: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-[#0f172a]/50 px-3 py-2 text-sm text-white focus:border-[#6366f1] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="mt-2 w-full cursor-pointer rounded-lg bg-indigo-600 py-2 text-sm font-bold text-white transition-all hover:bg-indigo-500 disabled:opacity-50 md:col-span-2"
            >
              {isSearching ? "Searching..." : "Execute Query"}
            </button>
          </form>

          {queryResults.length > 0 && (
            <div className="mt-6 max-h-[300px] overflow-y-auto">
              <h4 className="mb-2 text-xs font-bold text-slate-400">Query Results ({queryResults.length}):</h4>
              <div className="space-y-2">
                {queryResults.map((res, i) => (
                  <div key={i} className="rounded-lg border border-white/5 bg-white/5 p-3 text-xs">
                    <div className="flex justify-between font-mono text-indigo-300">
                      <span>Block: {res.blockNumber}</span>
                      <a href={`https://sepolia.etherscan.io/tx/${res.txHash}`} target="_blank" rel="noreferrer" className="text-indigo-500 hover:underline">
                        View Tx
                      </a>
                    </div>
                    <div className="mt-1 text-slate-300">
                      {Object.entries(res.args).map(([key, val]: [string, any]) => (
                        <div key={key}>
                          <span className="text-slate-500">{key}:</span> {val}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="max-h-[400px] overflow-y-auto rounded-xl border border-white/5 bg-black/20">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                <th className="p-4">Time</th>
                <th className="p-4">From</th>
                <th className="p-4">To</th>
                <th className="p-4">Value (USDT)</th>
                <th className="p-4">Link</th>
              </tr>
            </thead>
            <tbody>
              {liveEvents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    Listening for new events...
                  </td>
                </tr>
              ) : (
                liveEvents.map((ev, i) => (
                  <tr key={i} className="border-b border-white/5 transition-colors hover:bg-white/5">
                    <td className="p-4">{new Date(ev.timestamp).toLocaleTimeString()}</td>
                    <td className="p-4 font-mono text-indigo-300">
                      {ev.from.slice(0, 6)}...{ev.from.slice(-4)}
                    </td>
                    <td className="p-4 font-mono text-indigo-300">
                      {ev.to.slice(0, 6)}...{ev.to.slice(-4)}
                    </td>
                    <td className="p-4 font-bold text-emerald-400">{parseFloat(ev.value).toFixed(2)}</td>
                    <td className="p-4">
                      <a href={`https://sepolia.etherscan.io/tx/${ev.txHash}`} target="_blank" rel="noreferrer" className="font-semibold text-[#6366f1] hover:underline">
                        View
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
