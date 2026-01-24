import { useState, useEffect } from "react";
import { useParams, NavLink } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Briefcase,
  Clock,
  Edit2,
  Save,
  Trash2,
  Zap,
  Phone,
  FileText,
  Inbox,
  Globe,
  ChevronRight,
  Check,
  MessageSquare,
  Send,
  History,
} from "lucide-react";
import "../components/common/LeadDetails.css";
import initialFakeLeads from "/leads.json";
import ActivitySuggestions from "../components/common/ActivitySuggestions";

const PIPELINE_STEPS = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal Sent",
  "Closed",
];

export default function LeadDetails() {
  const { leadId } = useParams();

  // --- STATE ---
  const [lead, setLead] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  // Comments State
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);

  // --- EFFECT: LOAD DATA ---
  useEffect(() => {
    const foundLead = initialFakeLeads.find((l) => l._id === leadId);
    if (foundLead) {
      setLead(foundLead);
      setFormData(foundLead);
      setComments(foundLead.comments || []);
    }
  }, [leadId]);

  // --- HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAgentChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      agent: { ...prev.agent, agentName: e.target.value },
    }));
  };

  const handleTagsChange = (e) => {
    const tagsArray = e.target.value.split(",").map((t) => t.trim());
    setFormData((prev) => ({ ...prev, tags: tagsArray }));
  };

  const saveChanges = () => {
    setLead((prev) => ({
      ...prev,
      ...formData,
      comments: comments,
    }));
    setIsEditing(false);
  };

  const cancelChanges = () => {
    setFormData(lead);
    setIsEditing(false);
  };

  // --- COMMENT HANDLERS ---
  const handlePostComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newEntry = {
      _id: Date.now().toString(),
      author: lead.agent.agentName,
      text: newComment,
      timestamp: new Date().toISOString(),
      isSystem: false,
    };

    const updatedComments = [newEntry, ...comments];
    setComments(updatedComments);

    setLead((prev) => ({ ...prev, comments: updatedComments }));

    setNewComment("");
  };

  const handleDeleteComment = (commentId) => {
    const updatedComments = comments.filter((c) => c._id !== commentId);
    setComments(updatedComments);
    setLead((prev) => ({ ...prev, comments: updatedComments }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handlePostComment(e);
    }
  };

  // --- UTILS ---
  const getInitials = (author, isSystem) => {
    if (isSystem) return "SYS";
    if (!author) return "?";
    return author
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTimestamp = (isoString) => {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getCurrentStepIndex = (status) => PIPELINE_STEPS.indexOf(status);

  const getStepIcon = (step) => {
    switch (step) {
      case "New":
        return <Zap size={14} />;
      case "Contacted":
        return <Phone size={14} />;
      case "Qualified":
        return <User size={14} />;
      case "Proposal Sent":
        return <FileText size={14} />;
      case "Closed":
        return <Inbox size={14} />;
      default:
        return <Check size={14} />;
    }
  };

  if (!lead)
    return (
      <div className="lead-details-container loading-state">
        Loading Lead...
      </div>
    );

  const currentStep = getCurrentStepIndex(
    formData?.leadStatus || lead.leadStatus,
  );

  return (
    <div className="lead-details-wrapper">
      <div className="bg-pattern"></div>

      <main className="lead-details-container pageLoadAnimation">
        {/* HEADER */}
        <header className="page-header">
          <div className="breadcrumbs">
            <NavLink to={"/leads"} className="crumb-text">
              Leads
            </NavLink>
            <ChevronRight size={14} />
            <span className="crumb-active">Details</span>
          </div>
          <div className="header-content">
            <NavLink to="/leads" className="back-btn">
              <ArrowLeft size={20} />
            </NavLink>
            <div className="header-text-group">
              <h1 className="page-title">Lead Overview</h1>
              <div className="lead-id-badge">ID: #{lead._id}</div>
            </div>
          </div>
        </header>

        {/* DETAILS CARD */}
        <div className="details-card" >
          {/* Identity Section */}
          <div className="card-top-section">
            <div className="identity-wrapper">
              <div className="avatar-large">{lead.leadName.charAt(0)}</div>
              <div className="identity-content">
                {isEditing ? (
                  <input
                    className="edit-input title-input"
                    name="leadName"
                    value={formData.leadName}
                    onChange={handleInputChange}
                    autoFocus
                  />
                ) : (
                  <h2 className="lead-name">{lead.leadName}</h2>
                )}
                <div className="lead-meta">
                  <span className="meta-item">
                    <Globe size={13} /> {formData.leadSource}
                  </span>
                  <span className="meta-dot">•</span>
                  <span className="meta-item">
                    Created {formatTimestamp(lead.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            <div className="action-buttons">
              {isEditing ? (
                <>
                  <button className="btn-ghost" onClick={cancelChanges}>
                    Cancel
                  </button>
                  <button className="btn-solid" onClick={saveChanges}>
                    <Save size={16} /> Save Changes
                  </button>
                </>
              ) : (
                <button
                  className="btn-outline"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 size={15} /> Edit
                </button>
              )}
            </div>
          </div>

          {/* Pipeline */}
          <div className="pipeline-section">
            <div className="section-header">
              <h3 className="section-label">Pipeline Progress</h3>
              <span className="pipeline-percent">
                {Math.round(((currentStep + 1) / PIPELINE_STEPS.length) * 100)}%
              </span>
            </div>

            <div className="pipeline-track">
              <div className="track-line-bg"></div>
              <div
                className="track-line-fill"
                style={{
                  width: `${(currentStep / (PIPELINE_STEPS.length - 1)) * 100}%`,
                }}
              ></div>

              {PIPELINE_STEPS.map((step, index) => {
                const isCompleted = index <= currentStep;
                const isCurrent = index === currentStep;
                return (
                  <div
                    key={step}
                    className={`pipeline-step ${isCompleted ? "completed" : ""} ${isCurrent ? "current" : ""}`}
                  >
                    <div className="step-circle">
                      {index < currentStep ? (
                        <Check size={14} strokeWidth={3} />
                      ) : (
                        getStepIcon(step)
                      )}
                    </div>
                    <span className="step-label">{step}</span>
                  </div>
                );
              })}
            </div>

            {isEditing && (
              <div className="status-editor">
                <label>Manual Stage Override:</label>
                <select
                  className="edit-select"
                  name="leadStatus"
                  value={formData.leadStatus}
                  onChange={handleInputChange}
                >
                  {PIPELINE_STEPS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <hr className="divider" />

          {/* Grid Details */}
          <div className="card-body">
            <div className="grid-layout">
              {/* Column 1 */}
              <div className="grid-column">
                <h4 className="column-header">
                  <Briefcase size={16} /> Deal Info
                </h4>

                <div className="field-group">
                  <label>Priority Level</label>
                  {isEditing ? (
                    <select
                      className="edit-select"
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                    >
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  ) : (
                    <span
                      className={`badge-priority ${lead.priority.toLowerCase()}`}
                    >
                      {lead.priority}
                    </span>
                  )}
                </div>

                <div className="field-group">
                  <label>Est. Days to Close</label>
                  {isEditing ? (
                    <input
                      type="number"
                      className="edit-input"
                      name="timeToClose"
                      value={formData.timeToClose}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="value-txt">
                      <Clock size={14} className="txt-icon" />{" "}
                      {lead.timeToClose} Days
                    </div>
                  )}
                </div>
              </div>

              {/* Column 2 */}
              <div className="grid-column">
                <h4 className="column-header">
                  <User size={16} /> Assignment
                </h4>

                <div className="field-group">
                  <label>Sales Agent</label>
                  {isEditing ? (
                    <select
                      className="edit-select"
                      value={formData.agent.agentName}
                      onChange={handleAgentChange}
                    >
                      <option>Agent A</option>
                      <option>Agent B</option>
                      <option>Agent C</option>
                      <option>Sarah Jenkins</option>
                      <option>Marcus Sterling</option>
                    </select>
                  ) : (
                    <div className="agent-display">
                      <div className="agent-avatar-sm">
                        {getInitials(lead.agent.agentName, false)}
                      </div>
                      <div className="agent-details-txt">
                        <span className="agent-name-label">
                          {lead.agent.agentName}
                        </span>
                        <span className="agent-id-label">
                          {lead.agent.agentId}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="field-group">
                  <label>Tags</label>
                  {isEditing ? (
                    <input
                      className="edit-input"
                      value={formData.tags.join(", ")}
                      onChange={handleTagsChange}
                      placeholder="e.g. VIP, Urgent"
                    />
                  ) : (
                    <div className="tags-list">
                      {lead.tags.map((t) => (
                        <span key={t} className="tag-pill">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ACTIVITY & COMMENTS */}
        <section className="comments-section">
          <div className="comments-header">
            <h3>
              <History size={18} /> Activity Timeline
            </h3>
            <span className="comment-count">{comments.length}</span>
          </div>

          <div className="comments-card">
            <div className="comment-input-area">
              <form onSubmit={handlePostComment}>
                <textarea
                  placeholder="Log a call, note, or update..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={2}
                  onKeyDown={handleKeyDown}
                />

                <ActivitySuggestions lead={lead} onSelect={(text) => setNewComment(text)} />

                <div className="comment-actions">
                  <span className="hint-text">
                    <strong>Enter</strong> to post
                  </span>
                  <button
                    type="submit"
                    className="btn-solid btn-sm"
                    disabled={!newComment.trim()}
                  >
                    <Send size={14} /> Post
                  </button>
                </div>
              </form>
            </div>

            <div className="comments-feed">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div
                    key={comment._id}
                    className={`comment-item ${comment.isSystem ? "system-log" : ""}`}
                  >
                    {/* The Connector Line */}
                    <div className="timeline-connector"></div>

                    <div className="comment-avatar">
                      {comment.isSystem ? (
                        <Zap size={14} />
                      ) : (
                        getInitials(comment.author, comment.isSystem)
                      )}
                    </div>

                    <div className="comment-content">
                      <div className="comment-header-row">
                        <span className="comment-author">
                          {comment.isSystem ? "System" : comment.author}
                          {!comment.isSystem &&
                            comment.author === lead.agent.agentName && (
                              <span className="assignee-badge">You</span>
                            )}
                        </span>
                        <span className="comment-time">
                          {formatTimestamp(comment.timestamp)}
                        </span>
                      </div>

                      <p className="comment-text">{comment.text}</p>

                      {!comment.isSystem && (
                        <div className="comment-footer-actions">
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="action-link delete"
                          >
                            <Trash2 size={12} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-feed">
                  <MessageSquare size={32} />
                  <p>No activity recorded yet.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
