import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, Clock } from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import { useAuthStore } from "../../store/authStore";
import { useSocket } from "../../hooks/useSocket";
import { getAllComplaintsApi, replyToComplaintApi, resolveComplaintApi } from "../../api/complaints";
import type { Complaint, ComplaintMessage } from "../../types";

function AdminComplaints() {
  const socketRef = useSocket();
  const user = useAuthStore((state) => state.user);

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadComplaints();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [activeId, complaints]);

  // Live — new complaints and customer replies appear instantly.
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    function handleNew(complaint: Complaint) {
      setComplaints((prev) => [complaint, ...prev]);
    }

    function handleReply(payload: { complaintId: string; message: ComplaintMessage }) {
      setComplaints((prev) =>
        prev.map((c) =>
          c._id === payload.complaintId ? { ...c, messages: [...c.messages, payload.message] } : c
        )
      );
    }

    socket.on("complaint:new", handleNew);
    socket.on("complaint:reply", handleReply);
    return () => {
      socket.off("complaint:new", handleNew);
      socket.off("complaint:reply", handleReply);
    };
  }, [socketRef.current]);

  async function loadComplaints() {
    setIsLoading(true);
    const res = await getAllComplaintsApi();
    setComplaints(res.data);
    if (res.data.length > 0) setActiveId(res.data[0]._id);
    setIsLoading(false);
  }

  async function handleReply(e: FormEvent) {
    e.preventDefault();
    if (!activeId || !replyText.trim()) return;
    const text = replyText;
    setReplyText("");
    const res = await replyToComplaintApi(activeId, text);
    setComplaints((prev) => prev.map((c) => (c._id === activeId ? res.data : c)));
  }

  async function handleResolve() {
    if (!activeId) return;
    const res = await resolveComplaintApi(activeId);
    setComplaints((prev) => prev.map((c) => (c._id === activeId ? res.data : c)));
  }

  const active = complaints.find((c) => c._id === activeId);

  return (
    <AdminLayout>
      <h1 className="font-display text-3xl font-bold text-forest-900 mb-1">Customer Complaints</h1>
      <p className="text-forest-700/50 text-sm mb-8">Replies reach the customer instantly</p>

      <div className="grid lg:grid-cols-3 gap-6 bg-white rounded-2xl border border-forest-900/5 overflow-hidden min-h-[32rem]">
        <div className="lg:col-span-1 border-r border-forest-900/5 max-h-[32rem] overflow-y-auto">
          {isLoading ? (
            <p className="p-5 text-sm text-forest-700/40">Loading…</p>
          ) : complaints.length === 0 ? (
            <p className="p-5 text-sm text-forest-700/40">No complaints yet</p>
          ) : (
            complaints.map((c) => (
              <button
                key={c._id}
                onClick={() => setActiveId(c._id)}
                className={`w-full text-left px-5 py-4 border-b border-forest-900/5 transition-colors ${
                  activeId === c._id ? "bg-field-100" : "hover:bg-field-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm text-forest-900 truncate">{c.subject}</p>
                  {c.status === "open" && <span className="w-2 h-2 rounded-full bg-coral-500 shrink-0" />}
                </div>
                <p className="text-xs text-forest-700/50 mt-0.5">{c.userName}</p>
                <p className="text-xs text-forest-700/40 truncate mt-0.5">
                  {c.messages[c.messages.length - 1]?.text}
                </p>
              </button>
            ))
          )}
        </div>

        <div className="lg:col-span-2 flex flex-col max-h-[32rem]">
          {active ? (
            <>
              <div className="px-6 py-4 border-b border-forest-900/5 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-forest-900">{active.subject}</p>
                  <p className="text-xs text-forest-700/50">from {active.userName}</p>
                </div>
                {active.status === "open" ? (
                  <button
                    onClick={handleResolve}
                    className="flex items-center gap-1.5 text-xs font-semibold text-leaf-700 bg-leaf-500/10 px-3 py-1.5 rounded-full hover:bg-leaf-500/20"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Mark resolved
                  </button>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-leaf-700 bg-leaf-500/10 px-3 py-1.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
                  </span>
                )}
              </div>
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-3">
                <AnimatePresence initial={false}>
                  {active.messages.map((m, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${m.sender === "admin" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                          m.sender === "admin"
                            ? "bg-forest-900 text-white rounded-br-sm"
                            : "bg-field-100 text-forest-900 rounded-bl-sm"
                        }`}
                      >
                        <p>{m.text}</p>
                        <p className={`text-[10px] mt-1 ${m.sender === "admin" ? "text-white/50" : "text-forest-700/40"}`}>
                          {m.senderName} · {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <form onSubmit={handleReply} className="p-4 border-t border-forest-900/5 flex gap-2">
                <input
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Reply to customer…"
                  className="flex-1 px-4 py-2.5 rounded-full border border-forest-900/10 focus:outline-none focus:ring-2 focus:ring-leaf-400 text-sm"
                />
                <button
                  type="submit"
                  className="bg-forest-900 hover:bg-leaf-600 text-white p-2.5 rounded-full transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-forest-700/40 text-sm">
              Select a complaint to reply
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminComplaints;
