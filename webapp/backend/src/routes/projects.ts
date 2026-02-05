import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth';
import { verifyRepoAccess } from '../services/github';
import { generateProjectId, generateApiKey, hashApiKey } from '../services/keys';

const router = Router();
const prisma = new PrismaClient();

/**
 * POST /api/projects
 * Create a new project
 */
router.post('/', requireAuth, async (req, res, next) => {
    try {
        const user = req.user as any;
        const { repo_full_name, platform } = req.body;

        // Validate input
        if (!repo_full_name) {
            return res.status(400).json({
                error: {
                    code: 'MISSING_REPO',
                    message: 'repo_full_name is required',
                },
            });
        }

        if (!platform) {
            return res.status(400).json({
                error: {
                    code: 'MISSING_PLATFORM',
                    message: 'platform is required',
                },
            });
        }

        // Verify user has access to the repo
        const hasAccess = await verifyRepoAccess(user.githubAccessToken, repo_full_name);
        if (!hasAccess) {
            return res.status(403).json({
                error: {
                    code: 'REPO_ACCESS_DENIED',
                    message: 'You do not have access to this repository',
                },
            });
        }

        // Check if project already exists for this repo
        const existingProject = await prisma.project.findUnique({
            where: { repoFullName: repo_full_name },
        });

        if (existingProject) {
            return res.status(409).json({
                error: {
                    code: 'PROJECT_EXISTS',
                    message: 'A project already exists for this repository',
                },
            });
        }

        // Generate project ID and API key
        const projectId = generateProjectId();
        const apiKey = generateApiKey();
        const keyHash = await hashApiKey(apiKey);

        // Create project and API key in transaction
        const project = await prisma.project.create({
            data: {
                projectId,
                repoFullName: repo_full_name,
                platform,
                ownerUserId: user.id,
                apiKey: {
                    create: {
                        keyHash,
                    },
                },
            },
            include: {
                apiKey: true,
            },
        });

        // Return project with raw API key (ONLY TIME IT'S SHOWN)
        res.status(201).json({
            project: {
                id: project.id,
                project_id: project.projectId,
                repo_full_name: project.repoFullName,
                platform: project.platform,
                ingest_api_key: apiKey, // RAW KEY - SHOW ONCE
                created_at: project.createdAt,
            },
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/projects
 * List all projects for authenticated user
 */
router.get('/', requireAuth, async (req, res, next) => {
    try {
        const user = req.user as any;

        const projects = await prisma.project.findMany({
            where: {
                ownerUserId: user.id,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        res.json({
            projects: projects.map(project => ({
                id: project.id,
                project_id: project.projectId,
                repo_full_name: project.repoFullName,
                platform: project.platform,
                created_at: project.createdAt,
                // NOTE: API key is NEVER returned after creation
            })),
        });
    } catch (error) {
        next(error);
    }
});

/**
 * DELETE /api/projects/:projectId
 * Delete a project (requires ownership)
 */
router.delete('/:projectId', requireAuth, async (req, res, next) => {
    try {
        const user = req.user as any;
        const { projectId } = req.params;

        if (!projectId || typeof projectId !== 'string') {
            return res.status(400).json({
                error: {
                    code: 'INVALID_PROJECT_ID',
                    message: 'Invalid project ID',
                },
            });
        }

        // Find the project
        const project = await prisma.project.findUnique({
            where: { projectId },
        });

        if (!project) {
            return res.status(404).json({
                error: {
                    code: 'PROJECT_NOT_FOUND',
                    message: 'Project not found',
                },
            });
        }

        // Verify ownership
        if (project.ownerUserId !== user.id) {
            return res.status(403).json({
                error: {
                    code: 'FORBIDDEN',
                    message: 'You do not have permission to delete this project',
                },
            });
        }

        // Delete project (cascade will delete API key)
        await prisma.project.delete({
            where: { projectId },
        });

        res.json({
            message: 'Project deleted successfully',
        });
    } catch (error) {
        next(error);
    }
});

export default router;
