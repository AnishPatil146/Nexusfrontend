export default function Navbar() {
    const user = JSON.parse(localStorage.getItem("user"))

    return (
        <div className="flex justify-between items-center p-4 bg-white shadow">
            <h1 className="font-bold text-lg">PerformanceCRM</h1>

            {user && (
                <div className="flex items-center gap-3">
                    <img
                        src={user.photo}
                        alt="profile"
                        className="w-8 h-8 rounded-full"
                    />

                    <span className="text-sm font-medium">{user.name}</span>

                    <button
                        onClick={() => {
                            localStorage.clear()
                            window.location.href = "/"
                        }}
                        className="bg-black text-white px-3 py-1 rounded text-sm"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    )
}
