import React, { useState, useMemo } from "react";
import { NavLink } from "react-router-dom";
import {
  Filter,
  ArrowLeft,
  Search,
  X,
  User,
  Zap,
  CheckCircle,
  FileText,
  Phone,
  Inbox,
  ArrowUpDown,
  Calendar
} from "lucide-react";
import leadsData from "/leads.json";
import "../components/common/LeadsByStatus.css";

const getStatusIcon = (status) => {
  switch (status) {
    case "New": return <Zap size={13} />;
    case "Contacted": return <Phone size={13} />;
    case "Qualified": return <CheckCircle size={13} />;
    case "Proposal Sent": return <FileText size={13} />;
    case "Closed": return <Inbox size={13} />;
    default: return <User size={13} />;
  }
};

// --- Individual Status Column ---
const StatusColumn = ({ status, leads, allAgents }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [localAgent, setLocalAgent] = useState("All");
  const [localPriority, setLocalPriority] = useState("All");
  const [localSort, setLocalSort] = useState("default");

  const processedLeads = useMemo(() => {
    let data = [...leads];

    if (localAgent !== "All") {
      data = data.filter(l => l.agent.agentName === localAgent);
    }
    if (localPriority !== "All") {
      data = data.filter(l => l.priority === localPriority);
    }
    if (localSort === "asc") {
      data.sort((a, b) => a.timeToClose - b.timeToClose);
    } else if (localSort === "desc") {
      data.sort((a, b) => b.timeToClose - a.timeToClose);
    }

    return data;
  }, [leads, localAgent, localPriority, localSort]);

  const hasActiveFilters = localAgent !== "All" || localPriority !== "All" || localSort !== "default";
  const statusClass = `status-${status.replace(" ", "").toLowerCase()}`;

  return (
    <div className="lbs-column">
      <div className={`lbs-col-header ${statusClass}-border`}>
        <div className="lbs-col-title-row">
          <div className="lbs-title-group">
            <span className={`status-icon-bg ${statusClass}-bg`}>
              {getStatusIcon(status)}
            </span>
            <h3>{status}</h3>
            <span className="lbs-count">{processedLeads.length}</span>
          </div>
          
          <button 
            className={`lbs-filter-toggle ${hasActiveFilters || showFilters ? "active" : ""}`}
            onClick={() => setShowFilters(!showFilters)}
            title="Filter this column"
          >
            <Filter size={12} />
          </button>
        </div>

        <div className={`lbs-col-filters ${showFilters ? "open" : ""}`}>
          <select value={localAgent} onChange={(e) => setLocalAgent(e.target.value)}>
            <option value="All">All Agents</option>
            {allAgents.map(a => <option key={a} value={a}>{a.split(' ')[0]}</option>)}
          </select>
          
          <div className="lbs-filter-row-2">
            <select value={localPriority} onChange={(e) => setLocalPriority(e.target.value)}>
              <option value="All">Priority</option>
              <option value="High">High</option>
              <option value="Medium">Med</option>
              <option value="Low">Low</option>
            </select>
            
            <button 
              className="lbs-sort-btn" 
              onClick={() => setLocalSort(prev => prev === 'asc' ? 'desc' : 'asc')}
              title="Sort by Time to Close"
            >
              <ArrowUpDown size={11} />
              {localSort === 'asc' ? 'Fast' : localSort === 'desc' ? 'Slow' : 'Sort'}
            </button>
          </div>
        </div>
      </div>

      <div className="lbs-col-list-container">
        <div className="lbs-col-list-scroll">
          {processedLeads.length > 0 ? (
            processedLeads.map((lead) => (
              <NavLink to={`/leads/${lead._id}`} key={lead._id} className="lbs-tile">
                <div className={`lbs-tile-stripe ${lead.priority.toLowerCase()}`}></div>
                <div className="lbs-tile-content">
                  <div className="lbs-tile-top">
                    <span className="lbs-lead-name">{lead.leadName}</span>
                    {lead.priority === 'High' && <span className="urgent-dot"></span>}
                  </div>
                  <div className="lbs-tile-meta">
                    <span className="lbs-meta-item">
                      <User size={10} /> {lead.agent.agentName.split(' ')[0]}
                    </span>
                    <span className="lbs-meta-item">
                      <Calendar size={10} /> {lead.timeToClose}d
                    </span>
                  </div>
                </div>
              </NavLink>
            ))
          ) : (
            <div className="lbs-empty">No leads</div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function LeadsByStatus() {
  const [globalSearch, setGlobalSearch] = useState("");
  
  const allAgents = [...new Set(leadsData.map(l => l.agent.agentName))];
  const statusOrder = ["New", "Contacted", "Qualified", "Proposal Sent", "Closed"];

  const searchResults = useMemo(() => {
    if (!globalSearch) return leadsData;
    return leadsData.filter(l => 
      l.leadName.toLowerCase().includes(globalSearch.toLowerCase())
    );
  }, [globalSearch]);

  const groupedLeads = useMemo(() => {
    const groups = {};
    statusOrder.forEach(s => groups[s] = []);
    searchResults.forEach(lead => {
      if (groups[lead.leadStatus]) groups[lead.leadStatus].push(lead);
    });
    return groups;
  }, [searchResults]);

  return (
    <div className="lbs-wrapper pageLoadAnimation">
      <header className="lbs-header">
        <div className="lbs-header-left">
           <NavLink to="/leads" className="back-btn">
            <ArrowLeft size={18} />
          </NavLink>
          <div>
            <h2>Pipeline</h2>
            <p className="lbs-subtitle">Manage leads by status</p>
          </div>
        </div>

        <div className="lbs-header-right">
          <div className="lbs-search-box">
            <Search size={14} className="search-icon"/>
            <input 
              type="text" 
              placeholder="Search leads..." 
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
            />
             {globalSearch && <X size={14} className="clear-icon" onClick={()=>setGlobalSearch("")}/>}
          </div>
          <NavLink to={"/leads/new"} className="btn primary small">
            + Lead
          </NavLink>
        </div>
      </header>

      <div className="lbs-board-wrapper">
        <div className="lbs-board">
          {statusOrder.map(status => (
            <StatusColumn 
              key={status} 
              status={status} 
              leads={groupedLeads[status]} 
              allAgents={allAgents}
            />
          ))}
        </div>
      </div>
    </div>
  );
}