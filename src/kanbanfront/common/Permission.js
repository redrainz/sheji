const Permission = {
 'hap-kanban-service.issueManage':['hap-kanban-service.issue.findByKanbanIdGroupByColumn','hap-kanban-service.issue.create','hap-kanban-service.issue.findById', 'hap-kanban-service.issue.updateById','hap-kanban-service.issue.deleteById',
  'hap-kanban-service.issue.findByKanbanId','hap-kanban-service.issue.findByProjectId','hap-kanban-service.issue.findByProjectIdInHerarchy','hap-kanban-service.issue.findUserStoryAndTaskByProjectId','hap-kanban-service.issue.findIssuePageByProjectId','hap-kanban-service.issue.findBySprintId'],
  'hap-kanban-service.label':['hap-kanban-service.issue-label.deleteByLabelIdArr','hap-kanban-service.issue-label.findByIssueId','hap-kanban-service.issue-label.createByLabelIdArr','hap-kanban-service.issue-label.findByLabelId'],
  'hap-kanban-service.kanbanManage':['hap-kanban-service.kanban.create','hap-kanban-service.kanban.findKanbanById','hap-kanban-service.kanban.update','hap-kanban-service.kanban.deleteKanbanById','hap-kanban-service.kanban.findKanbansByProjectId','hap-kanban-service.kanban.findKanbansRecently',
  'hap-kanban-service.kanban.findKanbansBySprintId'],
  'hap-kanban-service.sprintManage':['hap-kanban-service.sprint.create','hap-kanban-service.sprint.findById','hap-kanban-service.sprint.deleteById','hap-kanban-service.sprint.updateById'],
  'hap-kanban-service.userStoryMap':['hap-kanban-service.user-story-mapper.findUserStoryMapByProjectId','hap-kanban-service.user-story-mapper.getTempIssue'],
};
export default Permission;
