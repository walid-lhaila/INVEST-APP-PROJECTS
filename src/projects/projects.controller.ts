import {
  Controller,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @MessagePattern({ cmd: 'createProjects' })
  async createProjects(@Payload() data: any) {
    const { token, payload } = data;
    if (!token) {
      throw new UnauthorizedException('TOKEN IS MISSING');
    }
    const username = await this.projectsService.verifyToken(token);
    const projectData = {
      ...payload,
      username,
    };
    return this.projectsService.createProjects(projectData);
  }

  @MessagePattern({ cmd: 'getProjects' })
  async getProjectsByUsername(@Payload() data: any) {
    const { token } = data;
    if (!token) {
      throw new UnauthorizedException('TOKEN IS MISSING');
    }
    const username = await this.projectsService.verifyToken(token);
    return this.projectsService.getProjectsByUsername(username);
  }

  @MessagePattern({ cmd: 'deleteProject' })
  async deleteProject(@Payload() data: any) {
    const { token, projectId } = data;
    if (!token) {
      throw new UnauthorizedException('TOKEN IS MISSING');
    }
    if (!projectId) {
      throw new NotFoundException('PROJECT ID IS REQUIRED');
    }

    const username = await this.projectsService.verifyToken(token);
    return this.projectsService.deleteProject(username, projectId);
  }
}
