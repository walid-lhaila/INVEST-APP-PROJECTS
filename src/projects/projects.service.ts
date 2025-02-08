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

}
