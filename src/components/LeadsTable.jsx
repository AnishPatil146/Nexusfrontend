export default function LeadsTable({ leads }) {
    if (leads.length === 0) {
        return <div>No leads found</div>;
    }

    return (
        <table className="w-full border">
            <thead className="bg-gray-100">
                <tr>
                    <th className="border p-2">Name</th>
                    <th className="border p-2">Email</th>
                    <th className="border p-2">Status</th>
                </tr>
            </thead>
            <tbody>
                {leads.map((lead) => (
                    <tr key={lead._id}>
                        <td className="border p-2">{lead.name}</td>
                        <td className="border p-2">{lead.email}</td>
                        <td className="border p-2">{lead.status || "New"}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
