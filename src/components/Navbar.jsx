export default function Navbar() {
    return (
        <div className="bg-white shadow p-4 flex justify-between items-center">
            <h2 className="font-semibold text-lg">Dashboard</h2>

            <button className="bg-black text-white px-4 py-1 rounded">
                Logout
            </button>
        </div>
    )
}
