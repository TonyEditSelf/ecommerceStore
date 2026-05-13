"use client";

import { useEffect, useState } from "react";
import { Search, User, CreditCard, Activity, ChevronRight, ArrowLeft } from "lucide-react";

export default function AdminCRM() {
  const [view, setView] = useState("customers"); // customers, leads, details
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (view === "customers") fetchCustomers();
    if (view === "leads") fetchLeads();
  }, [view]);

  useEffect(() => {
    if (selectedCustomerId) fetchDetails(selectedCustomerId);
  }, [selectedCustomerId]);

  async function fetchCustomers() {
    setLoading(true);
    const res = await fetch(`/api/customers${search ? `?email=${search}` : ""}`);
    const result = await res.json();
    setData(result.data || []);
    setLoading(false);
  }

  async function fetchLeads() {
    setLoading(true);
    const res = await fetch("/api/leads");
    const result = await res.json();
    setData(result.data || []);
    setLoading(false);
  }

  async function fetchDetails(id) {
    setLoading(true);
    const res = await fetch(`/api/customers?id=${id}`);
    const result = await res.json();
    setCustomerDetails(result.data);
    setLoading(false);
  }

  function openDetails(id) {
    setSelectedCustomerId(id);
    setView("details");
  }

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 rounded-[2rem] border border-borderSoft/50 bg-white/85 p-6 shadow-soft sm:p-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-2 rounded-2xl border border-borderSoft/30 bg-white p-1.5 shadow-subtle">
          <button 
            onClick={() => setView("customers")}
            className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${view === "customers" ? "bg-dark text-white shadow-soft" : "text-textSecondary hover:bg-background"}`}
          >
            Customer Hub
          </button>
          <button 
            onClick={() => setView("leads")}
            className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${view === "leads" ? "bg-dark text-white shadow-soft" : "text-textSecondary hover:bg-background"}`}
          >
            Leads & Intent
          </button>
        </div>
        
        {view !== "details" && (
          <div className="relative w-full max-w-md lg:flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-textSecondary/40" />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchCustomers()}
              placeholder="Filter by email address..."
              className="w-full pl-12 pr-6 py-3.5 text-sm font-medium rounded-2xl border border-borderSoft/50 bg-white outline-none focus:border-primary focus:ring-4 ring-primary/10 transition-all shadow-subtle"
            />
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <p className="text-textSecondary animate-pulse">Loading CRM data...</p>
        </div>
      ) : (
        <>
          {view === "customers" && (
            <div className="overflow-hidden rounded-2xl border border-borderSoft/50 bg-white shadow-subtle">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-borderSoft/30 bg-background/30 text-textSecondary">
                      <th className="py-4 px-6 font-bold uppercase tracking-wider text-[10px]">Client Name</th>
                      <th className="py-4 px-6 font-bold uppercase tracking-wider text-[10px]">Identifier</th>
                      <th className="py-4 px-6 font-bold uppercase tracking-wider text-[10px]">Registration</th>
                      <th className="py-4 px-6"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-borderSoft/30">
                    {data.map((c) => (
                      <tr key={c.id} className="group transition-colors hover:bg-background/20">
                        <td className="py-5 px-6 font-semibold text-textPrimary">{c.name}</td>
                        <td className="py-5 px-6 text-textSecondary">{c.email}</td>
                        <td className="py-5 px-6 text-textSecondary">{new Date(c.created_at).toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                        <td className="py-5 px-6 text-right">
                          <button onClick={() => openDetails(c.id)} className="font-bold text-primary hover:text-dark transition-colors">View Portfolio</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {view === "leads" && (
            <div className="overflow-hidden rounded-2xl border border-borderSoft/50 bg-white shadow-subtle">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-borderSoft/30 bg-background/30 text-textSecondary">
                      <th className="py-4 px-6 font-bold uppercase tracking-wider text-[10px]">Target Customer</th>
                      <th className="py-4 px-6 font-bold uppercase tracking-wider text-[10px]">Intent Status</th>
                      <th className="py-4 px-6 font-bold uppercase tracking-wider text-[10px]">Latest Engagement</th>
                      <th className="py-4 px-6"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-borderSoft/30">
                    {data.map((l) => (l.customer &&
                      <tr key={l.id} className="group transition-colors hover:bg-background/20">
                        <td className="py-5 px-6">
                          <p className="font-semibold text-textPrimary">{l.customer?.name}</p>
                          <p className="text-[11px] font-medium text-textSecondary/60">{l.customer?.email}</p>
                        </td>
                        <td className="py-5 px-6">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm border ${
                            l.status === 'converted' ? 'bg-green-50 text-green-700 border-green-200' : 
                            l.status === 'high intent' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                            'bg-blue-50 text-blue-700 border-blue-200'
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${
                              l.status === 'converted' ? 'bg-green-500' : 
                              l.status === 'high intent' ? 'bg-orange-500' :
                              'bg-blue-500'
                            }`} />
                            {l.status}
                          </span>
                        </td>
                        <td className="py-5 px-6 text-textSecondary font-medium">{new Date(l.last_activity).toLocaleString()}</td>
                        <td className="py-5 px-6 text-right">
                          <button onClick={() => openDetails(l.customer_id)} className="font-bold text-primary hover:text-dark transition-colors">Analyze Path</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {view === "details" && customerDetails && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <button 
                onClick={() => setView("customers")}
                className="group flex items-center gap-2 text-sm font-bold text-textSecondary hover:text-textPrimary transition-colors"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to Dashboard
              </button>

              <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
                <div className="space-y-8">
                  <div className="rounded-3xl border border-borderSoft/50 bg-white p-8 shadow-soft text-center">
                    <div className="mx-auto h-24 w-24 rounded-2xl bg-background flex items-center justify-center text-primary mb-6 shadow-subtle border border-borderSoft/30">
                      <User className="h-10 w-10" />
                    </div>
                    <h3 className="font-serif text-2xl text-textPrimary">{customerDetails.customer.name}</h3>
                    <p className="text-sm font-medium text-textSecondary/60 mt-2">{customerDetails.customer.email}</p>
                    <div className="mt-8 pt-8 border-t border-borderSoft/30 text-left space-y-4">
                       <div>
                         <p className="text-[10px] font-bold text-textSecondary uppercase tracking-[0.2em]">Strategy Segment</p>
                         <p className="mt-1.5 font-bold text-primary">{customerDetails.lead?.status ? customerDetails.lead.status.toUpperCase() : "QUALIFYING"}</p>
                       </div>
                       <div>
                         <p className="text-[10px] font-bold text-textSecondary uppercase tracking-[0.2em]">Lifecycle Stage</p>
                         <p className="mt-1.5 font-bold text-accentBrown">ACTIVE CUSTOMER</p>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="rounded-3xl border border-borderSoft/50 bg-white p-8 shadow-soft">
                    <h4 className="font-serif flex items-center gap-3 text-2xl text-textPrimary mb-8">
                      <Activity className="h-6 w-6 text-primary" /> Behavioral Insights
                    </h4>
                    <div className="relative ml-4 space-y-8 before:absolute before:-left-4 before:top-2 before:h-[calc(100%-8px)] before:w-px before:bg-gradient-to-b before:from-primary/50 before:via-borderSoft before:to-transparent">
                      {customerDetails.events.map((e) => (
                        <div key={e.id} className="relative flex gap-6 items-start group">
                          <div className="absolute -left-5 top-2.5 h-2 w-2 rounded-full bg-white ring-4 ring-primary shadow-subtle transition-transform group-hover:scale-125" />
                          <div className="flex-1">
                            <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">{e.event_type.replace(/_/g, ' ')}</p>
                            <p className="text-xs font-medium text-textSecondary/40 mt-1">{new Date(e.created_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                            {e.metadata && (
                              <div className="mt-3 overflow-hidden rounded-xl bg-background border border-borderSoft/30 p-4 transition-all group-hover:border-primary/20">
                                <pre className="font-mono text-[10px] text-textSecondary/70 leading-relaxed overflow-x-auto">
                                  {JSON.stringify(e.metadata, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      {customerDetails.events.length === 0 && <p className="text-sm font-medium text-textSecondary/40 py-8 italic">No behavioral data captured for this window.</p>}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-borderSoft/50 bg-white p-8 shadow-soft">
                    <h4 className="font-serif flex items-center gap-3 text-2xl text-textPrimary mb-8">
                      <CreditCard className="h-6 w-6 text-primary" /> Acquisition History
                    </h4>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {customerDetails.orders.map((o) => (
                        <div key={o.id} className="flex items-center justify-between p-5 border border-borderSoft/50 rounded-2xl bg-background/30 hover:bg-white hover:shadow-subtle transition-all duration-300 group">
                          <div>
                            <p className="text-xs font-bold text-textPrimary uppercase tracking-wider">#{o.id.toString().slice(-8).toUpperCase()}</p>
                            <p className="text-[11px] font-medium text-textSecondary/50 mt-1">{new Date(o.created_at).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-serif text-lg text-accentBrown group-hover:text-primary transition-colors">₹{o.total.toLocaleString("en-IN")}</p>
                            <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-tighter bg-white text-green-600 shadow-sm">{o.payment_status}</span>
                          </div>
                        </div>
                      ))}
                      {customerDetails.orders.length === 0 && <p className="col-span-2 text-sm font-medium text-textSecondary/40 py-8 italic">No transactions identified.</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
