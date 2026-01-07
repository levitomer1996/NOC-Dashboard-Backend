import { Controller, Post, Body, Headers, HttpCode, Logger } from '@nestjs/common';
import { AlertsGateway } from '../alerts.gateway';

@Controller('opsgenie')
export class OpsgenieController {
    private readonly logger = new Logger(OpsgenieController.name);

    constructor(private readonly alertsGateway: AlertsGateway) { }

    @Post('webhook')
    @HttpCode(200)
    async handleWebhook(
        @Body() body: any,
        @Headers('x-forwarded-for') ip?: string,
    ) {
        this.logger.log(`Received Opsgenie webhook from IP: ${ip ?? 'unknown'}`);
        this.logger.debug(`Payload: ${JSON.stringify(body, null, 2)}`);

        // Broadcast to WebSocket clients
        await this.alertsGateway.broadcastAlert(body);

        this.logger.log('Alert broadcasted to WebSocket clients.');

        return { status: 'ok' };
    }
}
