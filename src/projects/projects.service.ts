import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Projects, ProjectsDocument } from './entity/projects.entity';
import { Model } from 'mongoose';
import * as jwt from 'jsonwebtoken';
import { ProjectsDto } from './dto/projects.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Projects.name) private ProjectsModel: Model<ProjectsDocument>,
  ) {}

  async verifyToken(token: string): Promise<string> {
    const jwtToken = token.split(' ')[1];
    const decodedToken = jwt.decode(jwtToken) as jwt.JwtPayload;
    const id = decodedToken?.sub;
    if (!id) {
      throw new Error('Invalid token: ID not found.');
    }
    return id;
  }

  async createProjects(projectsDto: ProjectsDto): Promise<ProjectsDocument> {
    const createProjects = await this.ProjectsModel.create(projectsDto);
    return createProjects.save();
  }

  async getProjectsByUser(userId: string): Promise<ProjectsDocument[]> {
    const projects = this.ProjectsModel.find({ userId: userId }).exec();
    return projects;
  }

  async deleteProject(userId: string, projectId: string): Promise<{ message: string }> {
    const deletedProject = await this.ProjectsModel.findOneAndDelete({ userId: userId, _id: projectId });
    if (!deletedProject) {
      throw new Error('PROJECT NOT FOUND OR NOT AUTHORIZED TO DELETE');
    }
    return { message: 'Project Deleted Successfully'};
  }

}
