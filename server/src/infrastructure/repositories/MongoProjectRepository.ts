import { IProjectRepository } from "@/application/interfaces/repositories/IProjectRepository";
import { Project } from "@/domain/entities/Project";
import {
  ProjectDocument,
  ProjectModel,
} from "@/infrastructure/database/models/MongoProjectModel";
import { MongoBaseRepository } from "@/infrastructure/repositories/MongoBaseRepository";

export class MongoProjectRepository
  extends MongoBaseRepository<Project, ProjectDocument>
  implements IProjectRepository
{
  constructor() {
    super(ProjectModel);
  }

  protected mapToEntity(doc: ProjectDocument): Project {
    return new Project(
      doc.projectId,
      doc.projectKey,
      doc.name,
      doc.description,
      doc.workspaceId,
      doc.createdBy,
      doc.memberIds,
      doc.status,
      doc.issueSequence,
      doc.createdAt,
      doc.updatedAt
    );
  }

  async create(project: Project): Promise<Project> {
    return super.create({
      projectId: project.projectId,
      projectKey: project.projectKey,
      name: project.name,
      description: project.description,
      workspaceId: project.workspaceId,
      createdBy: project.createdBy,
      memberIds: project.memberIds,
      status: project.status,
      issueSequence: project.issueSequence,
    });
  }

  async countByWorkspaceId(workspaceId: string): Promise<number> {
    return ProjectModel.countDocuments({ workspaceId });
  }

  async findByWorkspaceId(workspaceId: string): Promise<Project[]> {
    return this.find({ workspaceId });
  }

  async findById(projectId: string): Promise<Project | null> {
    return this.findOne({ projectId });
  }
  
  async incrementIssueSequence(projectId: string): Promise<number> {
    const project = await ProjectModel.findOneAndUpdate(
      { projectId },
      { $inc: { issueSequence: 1 } },
      { new: true }
    );

    if (!project) {
      throw new Error("Project not found");
    }

    return project.issueSequence;
  }

  async findByNameAndWorkspace(
    name: string,
    workspaceId: string
  ): Promise<Project | null> {
    return this.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, "i") }, 
      workspaceId 
    });
  }

  async findByKeyAndWorkspace(
    projectKey: string,
    workspaceId: string
  ): Promise<Project | null> {
    return this.findOne({ 
      projectKey: projectKey.toUpperCase(), 
      workspaceId 
    });
  }

  async update(project: Project): Promise<Project> {
    const updatedProject = await this.updateOne(
      { projectId: project.projectId },
      {
        projectKey: project.projectKey,
        name: project.name,
        description: project.description,
        memberIds: project.memberIds,
        status: project.status,
        issueSequence: project.issueSequence,
        updatedAt: new Date(),
      }
    );

    if (!updatedProject) {
      throw new Error("Project not found");
    }

    return updatedProject;
  }
}
