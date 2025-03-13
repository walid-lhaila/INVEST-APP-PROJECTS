import { Test, type TestingModule } from "@nestjs/testing";
import { ProjectsService } from "../projects.service";
import type { Model } from "mongoose";
import { Projects, type ProjectsDocument } from "../entity/projects.entity";
import { getModelToken } from "@nestjs/mongoose";
import type { ProjectsDto } from "../dto/projects.dto";
import { NotFoundException } from "@nestjs/common";

describe("ProjectsService", () => {
    let service: ProjectsService;
    let model: Model<ProjectsDocument>;

    const mockProjectModel = {
        create: jest.fn(),
        new: jest.fn().mockImplementation((dto) => ({
            ...dto,
            save: jest.fn().mockResolvedValue({ _id: "1", ...dto }),
        })),
        constructor: jest.fn().mockImplementation((dto) => ({
            ...dto,
            save: jest.fn().mockResolvedValue({ _id: "1", ...dto }),
        })),
        find: jest.fn().mockReturnThis(),
        exec: jest.fn(),
        findOneAndDelete: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProjectsService,
                {
                    provide: getModelToken(Projects.name),
                    useValue: mockProjectModel,
                },
            ],
        }).compile();

        service = module.get<ProjectsService>(ProjectsService);
        model = module.get<Model<ProjectsDocument>>(getModelToken(Projects.name));
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("createProjects", () => {
        it("should create a project", async () => {
            const projectsDto: ProjectsDto = {
                title: "Test Project",
                description: "Test Description",
                userId: "testuser",
                tags: ["finance", "startup"],
                budget: 50000,
                startDate: new Date(),
                endDate: new Date(),
            };

            const mockSavedProject = {
                _id: "1",
                ...projectsDto,
            };

            // Mocking the behavior of create method
            mockProjectModel.create.mockResolvedValue(mockSavedProject);

            const result = await service.createProjects(projectsDto);
            expect(result).toEqual(mockSavedProject);
        });
    });

    describe("getProjectsByUsername", () => {
        it("should return projects for a username", async () => {
            const username = "testuser";
            const projects = [
                { name: "Project 1", description: "Description 1", username },
                { name: "Project 2", description: "Description 2", username },
            ];
            jest.spyOn(model, "find").mockReturnValue({
                exec: jest.fn().mockResolvedValue(projects),
            } as any);

            const result = await service.getProjectsByUsername(username);
            expect(result).toEqual(projects);
        });
    });

    describe("deleteProject", () => {
        it("should delete a project", async () => {
            const username = "testuser";
            const projectId = "1";
            const deletedProject = { _id: projectId, name: "Test Project", username };
            jest.spyOn(model, "findOneAndDelete").mockResolvedValue(deletedProject as any);

            const result = await service.deleteProject(username, projectId);
            expect(result).toEqual({ message: "Project Deleted Successfully" });
        });

        it("should throw NotFoundException if project not found", async () => {
            const username = "testuser";
            const projectId = "1";
            jest.spyOn(model, "findOneAndDelete").mockResolvedValue(null);

            await expect(service.deleteProject(username, projectId)).rejects.toThrow(NotFoundException);
        });
    });
});
