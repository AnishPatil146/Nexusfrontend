import { useState } from "react";

export default function LeadModal({ open, onClose, onSaved }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    if (!open) return null;

    const submit = async () => {
        if (!name || !email) return alert("Fill all fields");

        setLoading(true);

        try {
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/leads`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ name, email }),
            });

            setName("");
            setEmail("");
            onSaved(); // refresh leads
            onClose();
        } catch (err) {
            alert("Failed to save lead");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={overlay}>
            <div style={modal}>
                <h3>Add Lead</h3>

                <input
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={input}
                />
                <input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={input}
                />

                <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={submit} disabled={loading}>
                        {loading ? "Saving..." : "Save"}
                    </button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

/* styles */
const overlay = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};

const modal = {
    background: "#fff",
    padding: 20,
    borderRadius: 8,
    width: 300,
};

const input = {
    width: "100%",
    padding: 8,
    marginBottom: 10,
};
