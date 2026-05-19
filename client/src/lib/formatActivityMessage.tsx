import type { WorkspaceEvent } from "@/types/activity";
import React from "react";

export const formatActivityMessage = (event: WorkspaceEvent, actorName: string = "User"): React.ReactNode => {
  const { eventType, metadata } = event;

  const renderActor = <span className="font-semibold text-white hover:underline cursor-pointer">{actorName}</span>;

  const renderIssue = (key?: string, title?: string) => (
    <span className="inline-flex items-center space-x-1.5 font-medium text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20 hover:bg-indigo-500/20 transition-all cursor-pointer">
      <span>{key || "ISSUE"}</span>
      {title && <span className="text-gray-400 text-xs font-normal border-l border-gray-800 pl-1.5">{title}</span>}
    </span>
  );

  const renderSprint = (name?: string) => (
    <span className="inline-flex items-center font-medium text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20">
      {name || "Sprint"}
    </span>
  );

  const renderProject = (name?: string) => (
    <span className="inline-flex items-center font-medium text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-md border border-pink-500/20">
      {name || "Project"}
    </span>
  );

  const renderRole = (role?: string) => (
    <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
      {role || "MEMBER"}
    </span>
  );

  const renderStatus = (status?: string) => {
    const colors: Record<string, string> = {
      TODO: "text-blue-400 bg-blue-500/10 border-blue-500/20",
      IN_PROGRESS: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      DONE: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      BACKLOG: "text-gray-400 bg-gray-500/10 border-gray-500/20",
    };
    const c = colors[status?.toUpperCase() || ""] || "text-gray-400 bg-gray-500/10 border-gray-500/20";
    return (
      <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded border ${c}`}>
        {status || "TODO"}
      </span>
    );
  };

  switch (eventType) {
    case "ISSUE_CREATED":
      return (
        <span className="flex flex-wrap items-center gap-1.5">
          {renderActor} created issue {renderIssue(metadata?.issueKey, metadata?.title)}
        </span>
      );
    
    case "ISSUE_STATUS_CHANGED":
      return (
        <span className="flex flex-wrap items-center gap-1.5">
          {renderActor} moved {renderIssue(metadata?.issueKey)} from {renderStatus(metadata?.fromStatus)} → {renderStatus(metadata?.toStatus)}
        </span>
      );
    
    case "ISSUE_MOVED":
      return (
        <span className="flex flex-wrap items-center gap-1.5">
          {renderActor} moved {renderIssue(metadata?.issueKey)} to sprint {renderSprint(metadata?.toSprintName || `Sprint #${metadata?.toSprintId}`)}
        </span>
      );
    
    case "ISSUE_ASSIGNED":
      return (
        <span className="flex flex-wrap items-center gap-1.5">
          {renderActor} assigned {renderIssue(metadata?.issueKey)} to <span className="font-semibold text-gray-300">{metadata?.assigneeName || `User #${metadata?.assigneeId}`}</span>
        </span>
      );
      
    case "ISSUE_UNASSIGNED":
      return (
        <span className="flex flex-wrap items-center gap-1.5">
          {renderActor} unassigned {renderIssue(metadata?.issueKey)}
        </span>
      );

    case "ISSUE_COMMENT_ADDED":
      return (
        <span className="flex flex-wrap items-center gap-1.5">
          {renderActor} commented on {renderIssue(metadata?.issueKey)}
        </span>
      );

    case "SPRINT_STARTED":
      return (
        <span className="flex flex-wrap items-center gap-1.5">
          {renderActor} started sprint {renderSprint(metadata?.sprintName)}
        </span>
      );
      
    case "SPRINT_COMPLETED":
      return (
        <span className="flex flex-wrap items-center gap-1.5">
          {renderActor} completed sprint {renderSprint(metadata?.sprintName)}
        </span>
      );
      
    case "MEMBER_INVITED":
      return (
        <span className="flex flex-wrap items-center gap-1.5">
          {renderActor} invited <span className="font-medium text-teal-400">{metadata?.email}</span> as {renderRole(metadata?.role)}
        </span>
      );

    case "MEMBER_JOINED":
      return (
        <span className="flex flex-wrap items-center gap-1.5">
          {renderActor} joined the workspace as {renderRole(metadata?.role)}
        </span>
      );

    case "PROJECT_CREATED":
      return (
        <span className="flex flex-wrap items-center gap-1.5">
          {renderActor} created project {renderProject(metadata?.projectName)}
        </span>
      );

    case "PROJECT_UPDATED":
      return (
        <span className="flex flex-wrap items-center gap-1.5">
          {renderActor} updated project {renderProject(metadata?.projectName)}
        </span>
      );

    case "SPRINT_CREATED":
      return (
        <span className="flex flex-wrap items-center gap-1.5">
          {renderActor} created sprint {renderSprint(metadata?.sprintName)}
        </span>
      );

    default:
      return (
        <span className="flex flex-wrap items-center gap-1.5">
          {renderActor} performed <span className="text-gray-400 font-semibold">{eventType}</span>
        </span>
      );
  }
};
