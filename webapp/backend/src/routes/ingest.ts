import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyApiKey, generateIncidentId } from '../services/keys';

const router = Router();
const prisma = new PrismaClient();

/**
 * POST /api/ingest/error
 * Receive error telemetry (testing endpoint for Phase 1)
 */
router.post('/error', async (req, res, next) => {
    try {
        // Extract API key from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: {
                    code: 'MISSING_API_KEY',
                    message: 'Authorization header with Bearer token required',
                },
            });
        }

        const apiKey = authHeader.substring(7); // Remove 'Bearer '

        // Find project by API key
        const apiKeyRecord = await prisma.apiKey.findFirst({
            where: {
                revokedAt: null, // Only active keys
            },
            include: {
                project: true,
            },
        });

        if (!apiKeyRecord) {
            return res.status(401).json({
                error: {
                    code: 'INVALID_API_KEY',
                    message: 'Invalid or revoked API key',
                },
            });
        }

        // Verify API key hash
        const isValid = await verifyApiKey(apiKey, apiKeyRecord.keyHash);
        if (!isValid) {
            return res.status(401).json({
                error: {
                    code: 'INVALID_API_KEY',
                    message: 'Invalid or revoked API key',
                },
            });
        }

        // Extract error data from request
        const { summary, file_path, line_number } = req.body;

        if (!summary) {
            return res.status(400).json({
                error: {
                    code: 'MISSING_SUMMARY',
                    message: 'summary is required',
                },
            });
        }

        // Create incident
        const incidentId = generateIncidentId();
        const incident = await prisma.incident.create({
            data: {
                incidentId,
                projectId: apiKeyRecord.project.id,
                repoFullName: apiKeyRecord.project.repoFullName,
                summary,
                filePath: file_path || null,
                lineNumber: line_number || null,
                status: 'open',
            },
        });

        res.status(201).json({
            incident_id: incident.incidentId,
            status: 'created',
        });
    } catch (error) {
        next(error);
    }
});

export default router;
