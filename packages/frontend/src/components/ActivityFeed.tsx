import React, { useEffect, useState } from "react";
import { getEvents } from "../services/api";

const ActivityFeed: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          console.error("Events data is not an array:", data);
          setEvents([]);
        }
      } catch (err) {
        console.error("Failed to fetch events", err);
      }
    };

    fetchEvents();
    const interval = setInterval(fetchEvents, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#1e293b]/70 p-8 shadow-2xl backdrop-blur-xl md:col-span-2">
      <h3 className="mb-6 bg-gradient-to-r from-[#818cf8] to-[#c084fc] bg-clip-text text-xl font-bold text-transparent">Live Network Activity (WETH Transfer Events)</h3>
      <div className="max-h-[400px] overflow-y-auto rounded-xl border border-white/5 bg-black/20">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-slate-400">
              <th className="p-4">Time</th>
              <th className="p-4">From</th>
              <th className="p-4">To</th>
              <th className="p-4">Value (WETH)</th>
              <th className="p-4">Link</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">
                  Listening for new events...
                </td>
              </tr>
            ) : (
              events.map((ev, i) => (
                <tr key={i} className="border-b border-white/5 transition-colors hover:bg-white/5">
                  <td className="p-4">{new Date(ev.timestamp).toLocaleTimeString()}</td>
                  <td className="p-4 font-mono text-indigo-300">
                    {ev.from.slice(0, 6)}...{ev.from.slice(-4)}
                  </td>
                  <td className="p-4 font-mono text-indigo-300">
                    {ev.to.slice(0, 6)}...{ev.to.slice(-4)}
                  </td>
                  <td className="p-4 font-bold text-emerald-400">{parseFloat(ev.value).toFixed(4)}</td>
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
    </div>
  );
};

export default ActivityFeed;
