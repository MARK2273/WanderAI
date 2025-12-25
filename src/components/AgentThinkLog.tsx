"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Terminal } from "lucide-react";

interface LogEntry {
  message: string;
  timestamp: string;
}

interface AgentThinkLogProps {
  logs: LogEntry[];
}

export function AgentThinkLog({ logs }: AgentThinkLogProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="w-full bg-[#1e1e1e] rounded-lg border border-gray-700 font-mono text-sm overflow-hidden shadow-2xl">
      <div className="bg-[#2d2d2d] px-4 py-2 flex items-center gap-2 border-b border-gray-700">
        <Terminal size={14} className="text-gray-400" />
        <span className="text-gray-400">Agent Output</span>
      </div>
      <div className="p-4 h-48 overflow-y-auto space-y-2">
        {logs.map((log, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-green-400 break-words"
          >
            <span className="text-gray-500 mr-2">[{log.timestamp}]</span>
            {log.message}
          </motion.div>
        ))}
        {logs.length > 0 && (
          <div className="text-gray-500 animate-pulse">_</div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
