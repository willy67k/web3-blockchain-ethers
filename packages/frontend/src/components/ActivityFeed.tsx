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
    <div className="card glass" style={{ gridColumn: "1 / -1" }}>
      <h3>Live Network Activity (WETH Transfer Events)</h3>
      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.875rem" }}>
          <thead>
            <tr style={{ color: "var(--text-dim)", borderBottom: "1px solid var(--border)" }}>
              <th style={{ padding: "1rem" }}>Time</th>
              <th style={{ padding: "1rem" }}>From</th>
              <th style={{ padding: "1rem" }}>To</th>
              <th style={{ padding: "1rem" }}>Value (WETH)</th>
              <th style={{ padding: "1rem" }}>Link</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: "var(--text-dim)" }}>
                  Listening for new events...
                </td>
              </tr>
            ) : (
              events.map((ev, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "1rem" }}>{new Date(ev.timestamp).toLocaleTimeString()}</td>
                  <td style={{ padding: "1rem", fontFamily: "monospace" }}>
                    {ev.from.slice(0, 6)}...{ev.from.slice(-4)}
                  </td>
                  <td style={{ padding: "1rem", fontFamily: "monospace" }}>
                    {ev.to.slice(0, 6)}...{ev.to.slice(-4)}
                  </td>
                  <td style={{ padding: "1rem", fontWeight: "bold" }}>{parseFloat(ev.value).toFixed(4)}</td>
                  <td style={{ padding: "1rem" }}>
                    <a href={`https://sepolia.etherscan.io/tx/${ev.txHash}`} target="_blank" rel="noreferrer" style={{ color: "var(--primary)" }}>
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
