import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    unreadMessages,
  } = useChatStore();

  const { onlineUsers } = useAuthStore();

  const [search, setSearch] = useState("");

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  const [sidebarWidth, setSidebarWidth] = useState(320);

  useEffect(() => {
    getUsers();
  }, [getUsers]);



  const filteredUsers = users.filter((user) => {
  const matchesSearch = user.fullName
    .toLowerCase()
    .includes(search.toLowerCase());

  const matchesOnline = showOnlineOnly
    ? onlineUsers.includes(user._id)
    : true;

  return matchesSearch && matchesOnline;
});

  // const filteredUsers = showOnlineOnly
  //   ? users.filter((user) => onlineUsers.includes(user._id))
  //   : users;

  // const startResize = (e) => {
  //   e.preventDefault();

  //   const handleMouseMove = (event) => {
  //     const newWidth = Math.min(Math.max(event.clientX, 260), 500);
  //     setSidebarWidth(newWidth);
  //   };

  //   const stopResize = () => {
  //     document.removeEventListener("mousemove", handleMouseMove);
  //     document.removeEventListener("mouseup", stopResize);
  //   };

  //   document.addEventListener("mousemove", handleMouseMove);
  //   document.addEventListener("mouseup", stopResize);
  // };

  const startResize = (e) => {
  e.preventDefault();

  const handleMouseMove = (event) => {
    const newWidth = Math.min(Math.max(event.clientX, 260), 500);
    setSidebarWidth(newWidth);
  };

  const stopResize = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", stopResize);
  };

  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", stopResize);
};

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside
      className="relative h-full border-r border-base-300 flex flex-col"
      style={{ width: `${sidebarWidth}px` }}
    >


      <div
        onMouseDown={startResize}
        className="absolute top-0 right-0 h-full w-1 cursor-col-resize bg-transparent hover:bg-primary"
      />


      <div className="border-b border-base-300 p-5">
        <h2 className="text-3xl font-bold">Chats</h2>

        <div className="mt-4 relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search chats..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-bordered w-full pl-10 rounded-full bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* <div className="mt-4 flex items-center gap-2">
          <input
            type="checkbox"
            checked={showOnlineOnly}
            onChange={(e) => setShowOnlineOnly(e.target.checked)}
            className="checkbox checkbox-sm"
          />

          <span className="text-sm">Show online only</span>

          <span className="text-xs text-zinc-500">
            ({onlineUsers.length - 1} online)
          </span>
        </div> */}
      </div>


      <div className="overflow-y-auto flex-1 py-2">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`w-[95%] mx-auto p-3 flex items-center gap-3 rounded-2xl hover:bg-base-300 hover:shadow-md transition-all duration-200 ${
              selectedUser?._id === user._id
                ? "bg-base-300 border-r-4 border-primary"
                : ""
            }`}
          >
            <div className="relative">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.fullName}
                className="w-12 h-12 rounded-full object-cover"
              />

              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 ring-2 ring-base-100"></span>
              )}
            </div>

            <div className="flex-1 text-left overflow-hidden">
              <div className="flex justify-between items-center">
                <p className="font-semibold truncate">{user.fullName}</p>

                {unreadMessages[user._id] > 0 && (
                  <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                    {unreadMessages[user._id]}
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-500">
                {onlineUsers.includes(user._id) ? " Online" : " Offline"}
              </p>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center py-6 text-gray-500">No users found</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
