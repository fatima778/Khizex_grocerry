import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, Plus, CheckCircle2, Clock } from "lucide-react";
import StorefrontLayout from "../layouts/StorefrontLayout";
import { useAuthStore } from "../store/authStore";
import { useSocket } from "../hooks/useSocket";
import {
  getMyComplaintsApi,
  createComplaintApi,
  replyToComplaintApi,
} from "../api/complaints";
import type { Complaint, ComplaintMessage } from "../types";

function ContactUs() {
  const user = useAuthStore((state) => state.user);
  const socketRef = useSocket();

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [replyText, setReplyText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadComplaints();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [activeId, complaints]);

  // Live updates — when support replies, message appears instantly here.
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !user) return;

    function handleReply(payload: { complaintId: string; message: ComplaintMessage; targetUserId: string }) {
      if (payload.targetUserId !== user!.id) return;
      setComplaints((prev) =>
        prev.map((c) =>
          c._id === payload.complaintId ? { ...c, messages: [...c.messages, payload.message] } : c
        )
      );
    }

    socket.on("complaint:reply", handleReply);
    return () => {
      socket.off("complaint:reply", handleReply);
    };
  }, [socketRef.current, user]);

  async function loadComplaints() {
    setIsLoading(true);
    const res = await getMyComplaintsApi();
    setComplaints(res.data);
    if (res.data.length > 0 && !activeId) setActiveId(res.data[0]._id);
    else if (res.data.length === 0) setShowNewForm(true);
    setIsLoading(false);
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    const res = await createComplaintApi({ subject, message });
    setComplaints((prev) => [res.data, ...prev]);
    setActiveId(res.data._id);
    setShowNewForm(false);
    setSubject("");
    setMessage("");
  }

  async function handleReply(e: FormEvent) {
    e.preventDefault();
    if (!activeId || !replyText.trim()) return;
    const text = replyText;
    setReplyText("");
    const res = await replyToComplaintApi(activeId, text);
    setComplaints((prev) => prev.map((c) => (c._id === activeId ? res.data : c)));
  }

  const active = complaints.find((c) => c._id === activeId);

  return (
    <StorefrontLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-leaf-600">Support</span>
            <h1 className="font-display text-3xl font-bold text-forest-900 mt-1">Your Complaints</h1>
          </div>
          <button
            onClick={() => {
              setShowNewForm(true);
              setActiveId(null);
            }}
            className="flex items-center gap-2 bg-forest-900 hover:bg-leaf-600 text-white font-semibold px-5 py-2.5 rounded-full transition-colors"
          >
            <Plus className="w-4 h-4" /> New complaint
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 bg-white rounded-3xl border border-forest-900/5 overflow-hidden min-h-[32rem]">
          {/* Thread list */}
          <div className="lg:col-span-1 border-r border-forest-900/5 max-h-[32rem] overflow-y-auto">
            {isLoading ? (
              <p className="p-5 text-sm text-forest-700/40">Loading…</p>
            ) : complaints.length === 0 ? (
              <p className="p-5 text-sm text-forest-700/40">No complaints yet. Start a new one!</p>
            ) : (
              complaints.map((c) => (
                <button
                  key={c._id}
                  onClick={() => {
                    setActiveId(c._id);
                    setShowNewForm(false);
                  }}
                  className={`w-full text-left px-5 py-4 border-b border-forest-900/5 transition-colors ${
                    activeId === c._id ? "bg-field-100" : "hover:bg-field-50"
                  }`}
                >
                  <p className="font-semibold text-sm text-forest-900 truncate">{c.subject}</p>
                  <p className="text-xs text-forest-700/40 truncate mt-0.5">
                    {c.messages[c.messages.length - 1]?.text}
                  </p>
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full mt-2 ${
                      c.status === "open" ? "bg-mustard-500/15 text-mustard-600" : "bg-leaf-500/15 text-leaf-700"
                    }`}
                  >
                    {c.status === "open" ? <Clock className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                    {c.status === "open" ? "Awaiting reply" : "Resolved"}
                  </span>
                </button>
              ))
            )}
          </div>

          {/* Chat / new complaint form */}
          <div className="lg:col-span-2 flex flex-col max-h-[32rem]">
            {showNewForm ? (
              <form onSubmit={handleCreate} className="p-6 space-y-4 flex-1 flex flex-col justify-center">
                <div className="text-center mb-2">
                  <MessageCircle className="w-10 h-10 text-leaf-500 mx-auto mb-2" />
                  <h2 className="font-display text-xl font-bold text-forest-900">Start a new complaint</h2>
                  <p className="text-sm text-forest-700/50">We usually reply within a few hours</p>
                </div>
                <input
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject (e.g. Order arrived damaged)"
                  className="w-full px-4 py-3 rounded-xl border border-forest-900/10 focus:outline-none focus:ring-2 focus:ring-leaf-400 text-sm"
                />
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="Describe your issue…"
                  className="w-full px-4 py-3 rounded-xl border border-forest-900/10 focus:outline-none focus:ring-2 focus:ring-leaf-400 text-sm"
                />
                <button
                  type="submit"
                  className="bg-forest-900 hover:bg-leaf-600 text-white font-semibold py-3 rounded-full transition-colors"
                >
                  Submit complaint
                </button>
              </form>
            ) : active ? (
              <>
                <div className="px-6 py-4 border-b border-forest-900/5">
                  <p className="font-semibold text-forest-900">{active.subject}</p>
                </div>
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-3">
                  <AnimatePresence initial={false}>
                    {active.messages.map((m, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${m.sender === "customer" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                            m.sender === "customer"
                              ? "bg-forest-900 text-white rounded-br-sm"
                              : "bg-field-100 text-forest-900 rounded-bl-sm"
                          }`}
                        >
                          <p>{m.text}</p>
                          <p className={`text-[10px] mt-1 ${m.sender === "customer" ? "text-white/50" : "text-forest-700/40"}`}>
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
                    placeholder="Type a message…"
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
                Select a complaint to view the conversation
              </div>
            )}
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}

export default ContactUs;
