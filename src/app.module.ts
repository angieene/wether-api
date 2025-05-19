import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { validate as validateEnv } from 'src/common/validations/env.validation';

import { AppController } from './app.controller';
import { CommonModule } from './common/common.module';
import getConfiguration, { config } from './common/configuration';
import { SubscriptionModule } from './subscription/subscription.module';
import { WetherModule } from './wether/wether.module';

@Module({
  imports: [
    BullModule.forRoot(config.redis),
    HttpModule,
    DevtoolsModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        http: !configService.get('isProduction'),
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
      load: [getConfiguration],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ({
          type: 'postgres',
          autoLoadEntities: true,
          port: 3306,
          migrations: ['./src/common/migrations/*.ts'],
          logging: true,
          ...configService.get('database'),
        }) as TypeOrmModuleOptions,
    }),
    WetherModule,
    SubscriptionModule,
    CommonModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
