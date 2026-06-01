import { Menu, Search, Bell, Plus, Users, Download } from "lucide-react";

function TopBar({
  search = "",
  setSearch = () => {},
  setMobileOpen = () => {},
}) {
  return (
    <div className="topbar">
      <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)}>
        <Menu size={22} />
      </button>

      <div className="search-box">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="topbar-actions">
        <button className="icon-btn">
          <Bell size={18} />
        </button>

        <button className="share-btn">
          <Users size={16} />
          <span>Share</span>
        </button>

        <button className="icon-btn">
          <Download size={18} />
        </button>

        <button className="new-btn">
          <Plus size={18} />
          <span>New</span>
        </button>
      </div>
    </div>
  );
}

export default TopBar;