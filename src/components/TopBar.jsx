import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  Plus,
  Link,
  X,
  Check,
  Users,
  Download,
} from "lucide-react";
import { getData, saveData, exportData } from "../utils/storage";

function TopBar({ search = "", setSearch = () => {} }) {
  const navigate = useNavigate();

  const [shareOpen, setShareOpen] = useState(false);
  const [newOpen, setNewOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");

  const [members, setMembers] = useState(
    getData().sharedMembers || ["monikasrvnn@gmail.com"]
  );

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  const inviteMember = () => {
    if (!inviteEmail.trim()) {
      alert("Enter your friend's email");
      return;
    }

    if (members.includes(inviteEmail)) {
      alert("This member is already added");
      return;
    }

    const updatedMembers = [...members, inviteEmail];

    const data = getData();

    const updatedData = {
      ...data,
      sharedMembers: updatedMembers,
    };

    saveData(updatedData);
    setMembers(updatedMembers);
    setInviteEmail("");

    alert("Study invite added ✅ Copy the link and share it.");
  };

  const newActions = [
    {
      label: "📚 New Course",
      action: () => navigate("/subjects"),
    },
    {
      label: "✅ New Task",
      action: () => navigate("/tasks"),
    },
    {
      label: "✨ New AI Plan",
      action: () => navigate("/planner"),
    },
    {
      label: "🗺️ New Roadmap",
      action: () => navigate("/roadmap"),
    },
    {
      label: "🧠 New Flashcard",
      action: () => navigate("/flashcards"),
    },
    {
      label: "📝 New Quiz",
      action: () => navigate("/quiz"),
    },
    {
      label: "👥 New Study Room",
      action: () => navigate("/study-room"),
    },
    {
      label: "📅 New Calendar Event",
      action: () => navigate("/calendar"),
    },
    {
      label: "⬇️ Export Workspace",
      action: () => exportData(),
    },
  ];

  return (
    <>
      <div className="topbar">
        <div className="search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search subjects, tasks, notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="topbar-actions">
          <button
            className="icon-btn"
            onClick={() => alert("No new notifications yet 🔔")}
            title="Notifications"
          >
            <Bell size={18} />
          </button>

          <button
            className="share-btn"
            onClick={() => setShareOpen(true)}
            title="Share workspace"
          >
            <Users size={16} />
            <span>Share</span>
          </button>

          <button
            className="icon-btn"
            onClick={exportData}
            title="Export workspace"
          >
            <Download size={18} />
          </button>

          <div className="new-menu-wrap">
            <button
              className="new-btn"
              onClick={() => setNewOpen(!newOpen)}
              title="Create new"
            >
              <Plus size={16} />
              <span>New</span>
            </button>

            {newOpen && (
              <div className="new-dropdown">
                {newActions.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      item.action();
                      setNewOpen(false);
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {shareOpen && (
        <div className="modal-overlay">
          <div className="share-modal">
            <div className="modal-head">
              <h3>Study Together</h3>

              <button onClick={() => setShareOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <p className="share-helper">
              Invite friends and share your workspace link to study together.
            </p>

            <input
              className="input"
              placeholder="Friend's email..."
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />

            <button className="btn" onClick={inviteMember}>
              Invite to Study
            </button>

            <div className="share-user">
              <div className="avatar">M</div>

              <div>
                <b>Monika Saravanan</b>
                <p>Owner • Full access</p>
              </div>
            </div>

            <div className="general-access">
              <b>
                <Users size={16} /> Study Members
              </b>

              {members.length === 0 ? (
                <p>No members invited yet.</p>
              ) : (
                members.map((email) => <p key={email}>• {email}</p>)
              )}
            </div>

            <button className="copy-link" onClick={copyLink}>
              {copied ? <Check size={16} /> : <Link size={16} />}
              {copied ? "Copied!" : "Copy study link"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default TopBar;