import { Sparkles } from "lucide-react";

const STATUS_SUGGESTIONS = {
  New: [
    "Reviewing {priority} priority inquiry from {source}.",
    "Sent introductory email to {client} regarding their {source} request.",
    "Assigning {agent} to handle this {priority} priority lead.",
  ],
  Contacted: [
    "Spoke with {client}. Aiming to close in {days} days.",
    "Discussed requirements. {client} is a {priority} priority prospect.",
    "Follow-up scheduled. Source: {source} lead.",
  ],
  Qualified: [
    "{client} meets criteria. Estimated close: {days} days.",
    "Marked {client} as a {priority} value opportunity.",
    "confirmed budget and timeline with {client}.",
  ],
  "Proposal Sent": [
    "Proposal sent to {client}. Target close: {days} days.",
    "Followed up on the proposal sent to {client}.",
    "Negotiating terms for this {priority} priority deal.",
  ],
  Closed: [
    "Deal closed! {client} originating from {source} is onboard.",
    "Final contract signed by {client}.",
    "Handover completed for {client} (Agent: {agent}).",
  ],
};

export default function ActivitySuggestions({ lead, onSelect }) {
  if (!lead) return null;

  const status = lead.leadStatus || "New";
  const suggestions = STATUS_SUGGESTIONS[status] || STATUS_SUGGESTIONS["New"];

  const formatSuggestion = (text) => {
    return text
      .replace(/{client}/g, lead.leadName || "the client")
      .replace(/{agent}/g, lead.agent?.agentName || "me")
      .replace(/{priority}/g, lead.priority || "Standard")
      .replace(/{days}/g, lead.timeToClose || "?")
      .replace(/{source}/g, lead.leadSource || "inquiry");
  };

  return (
    <div className="activity-suggestions">
      <div className="suggestions-header">
        <Sparkles size={14} className="sparkle-icon" />
        <span>Smart Actions</span>
      </div>

      <div className="suggestion-list">
        {suggestions.map((text, i) => {
          const finalText = formatSuggestion(text);

          return (
            <button
              key={i}
              type="button"
              className="suggestion-chip"
              onClick={() => onSelect(finalText)}
            >
              {finalText}
            </button>
          );
        })}
      </div>
    </div>
  );
}