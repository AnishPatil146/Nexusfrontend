import React, { forwardRef } from "react";

const InvoiceTemplate = forwardRef(({ data }, ref) => {
    if (!data) return null;

    // --- 🛠️ SAFE DATA HANDLING ---
    // 1. Client Name (Object ya String dono handle karega)
    const clientName = typeof data.client === "object" ? data.client.name : data.client;

    // 2. Date Formatting
    const formatDate = (dateString) => {
        if (!dateString) return new Date().toLocaleDateString();
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? new Date().toLocaleDateString() : date.toLocaleDateString();
    };

    // 3. 🧮 MATH FIX (String to Number conversion)
    const amount = Number(data.amount) || 0; // Ensure Number
    const tax = amount * 0.18; // 18% GST
    const total = amount + tax; // ✅ Ab ye Plus karega, Chipkayega nahi

    return (
        <div ref={ref} className="bg-white p-10 max-w-[210mm] mx-auto text-slate-800 font-sans leading-relaxed">
            {/* HEADER */}
            <div className="flex justify-between items-start mb-12">
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="bg-indigo-600 text-white p-2 rounded-lg font-bold text-2xl">P</div>
                        <h1 className="text-2xl font-bold text-slate-900">Performance CRM</h1>
                    </div>
                    <p className="text-sm text-slate-500">Tech Park, Andheri East<br />Mumbai, Maharashtra - 400093<br />support@perfcrm.com</p>
                </div>
                <div className="text-right">
                    <h2 className="text-4xl font-light text-slate-300 uppercase tracking-widest">Invoice</h2>
                    <p className="font-mono text-slate-600 mt-2">#{data.id || "INV-NEW"}</p>
                    <p className="text-sm text-slate-500">Date: {formatDate(data.date)}</p>
                    <div className={`mt-2 inline-block px-3 py-1 rounded text-xs font-bold uppercase ${data.status === 'Paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                        {data.status}
                    </div>
                </div>
            </div>

            {/* CLIENT DETAILS */}
            <div className="bg-slate-50 p-6 rounded-xl mb-10 flex justify-between">
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Billed To</p>
                    <h3 className="text-xl font-bold text-slate-800">{clientName || "Unknown Client"}</h3>
                    <p className="text-sm text-slate-500">Personal Account</p>
                </div>
                <div className="text-right">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Due Date</p>
                    <p className="font-bold text-slate-700">{formatDate(data.date)}</p>
                </div>
            </div>

            {/* TABLE */}
            <table className="w-full mb-8">
                <thead>
                    <tr className="border-b-2 border-slate-100">
                        <th className="text-left py-3 text-xs font-bold text-slate-400 uppercase">Description</th>
                        <th className="text-right py-3 text-xs font-bold text-slate-400 uppercase">Rate</th>
                        <th className="text-right py-3 text-xs font-bold text-slate-400 uppercase">Qty</th>
                        <th className="text-right py-3 text-xs font-bold text-slate-400 uppercase">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-b border-slate-50">
                        <td className="py-4">
                            <p className="font-bold text-slate-700">Service Charge</p>
                            <p className="text-xs text-slate-500">Professional services rendered</p>
                        </td>
                        <td className="text-right py-4 text-slate-600">₹{amount.toLocaleString()}</td>
                        <td className="text-right py-4 text-slate-600">1</td>
                        <td className="text-right py-4 font-bold text-slate-800">₹{amount.toLocaleString()}</td>
                    </tr>
                </tbody>
            </table>

            {/* TOTALS */}
            <div className="flex justify-end">
                <div className="w-64 space-y-3">
                    <div className="flex justify-between text-sm text-slate-600">
                        <span>Subtotal</span>
                        <span>₹{amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-600">
                        <span>Tax (18% GST)</span>
                        <span>₹{tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-slate-900 border-t-2 border-slate-100 pt-3">
                        <span>Total Due</span>
                        <span className="text-indigo-600">₹{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <div className="mt-12 border-t border-slate-100 pt-6 text-center text-xs text-slate-400">
                <p>Thank you for your business!</p>
            </div>
        </div>
    );
});

export default InvoiceTemplate;