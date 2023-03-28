import { ExceptionHandlers } from "@traceo-sdk/node";
import { IIncident, IncidentEventPayload, IncidentStatus, SDK } from "@traceo/types";
import dayjs from "dayjs";
import { PoolClient } from "pg";
import { DatabaseService } from "../db/database";
import { Core, RelayEventType } from "../types";
import { logger } from "..";

type IncidentEvent = RelayEventType<IncidentEventPayload>;

export const handleIncidentEvent = async (core: Core, message: string) => {
    logger.info("☢ Processing incoming incident event from kafka ...")

    try {
        const incidentEvent = JSON.parse(message) as IncidentEvent;
        const event = await captureEvent(incidentEvent, core.db);

        return event;
    } catch (error) {
        const message = `❌ Cannot process incoming event. Caused by: ${error}`;
        logger.error(message);
        ExceptionHandlers.catchException(message);

        throw error;
    }
}

const captureEvent = async ({
    appId: app_id,
    sdk,
    payload
}: IncidentEvent, db: DatabaseService) => {
    const now = dayjs().unix();

    const processedIncident = await db.postgresTransaction(async (client: PoolClient) => {
        const app = await db.getApplicationById(app_id, client);

        if (!app) {
            logger.error(`❌ Cannot process incident event. Caused by: Cannot find app with provided id: ${app_id}.`);
            return;
        }

        const incident = await db.getIncident({
            name: payload["type"],
            message: payload.message,
            appId: app_id
        }, client);

        if (!incident) {
            const incident: Partial<IIncident> = {
                ...payload,
                sdk: sdk as SDK,
                status: IncidentStatus.UNRESOLVED,
                application: app,
                createdAt: now,
                name: payload["type"],
            };

            await db.createIncident(incident, payload, client);

            logger.info(`✔ New incident created for app: ${app_id}, sdk: ${sdk}, name: ${payload["type"]}`);

            return;
        }

        const event = await db.createEvent({
            date: now,
            incident,
            application: app,

            browser: payload?.browser || undefined,
        }, client);


        if (!event) {
            // Rollback whole transaction if event has not been saved to postgres
            await client.query('ROLLBACK');

            logger.error('❌ Event has not been properly saved to database. Transaction has been rolled back.');

            return;
        }

        logger.info(`✔ Created new Event: ${event.id} for incident: ${incident.id}`)
    });

    return processedIncident;
}