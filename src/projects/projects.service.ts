import { Injectable, NotFoundException } from '@nestjs/common';
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
    const username = decodedToken?.preferred_username;
    if (!username) {
      throw new Error('Invalid token: Username not found.');
    }
    return username;
  }

  async createProjects(projectsDto: ProjectsDto): Promise<ProjectsDocument> {
    return this.ProjectsModel.create(projectsDto);

  }

  async getProjectsByUsername(username: string): Promise<ProjectsDocument[]> {
    return this.ProjectsModel.find({ username }).exec();
  }

  async deleteProject(username: string, projectId: string): Promise<{ message: string }> {
    const deletedProject = await this.ProjectsModel.findOneAndDelete({ username, _id: projectId });

    if (!deletedProject) {
      throw new NotFoundException('PROJECT NOT FOUND OR NOT AUTHORIZED TO DELETE');
    }

    return { message: 'Project Deleted Successfully' };
  }
}
