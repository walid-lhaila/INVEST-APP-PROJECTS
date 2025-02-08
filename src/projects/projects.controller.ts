import { Controller, UnauthorizedException } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @MessagePattern({ cmd: 'createProjects' })
  async createProjects(@Payload() data: any) {
    const { token, payload } = data;
    if (!token) {
      throw new UnauthorizedException('TOKEN IS MESSING');
    }
    const userId = await this.projectsService.verifyToken(token);
    const projectData = {
      ...payload,
      userId,
    };
    return this.projectsService.createProjects(projectData);
  }

  @MessagePattern({ cmd: 'getProjects' })
  async getProjectsByUser(@Payload() data: any) {
      const { token } = data;
      if(!token) {
          throw new UnauthorizedException('TOKEN IS MESSING');
      }
      const userId = await this.projectsService.verifyToken(token);
      return this.projectsService.getProjectsByUser(userId);
  }

}
