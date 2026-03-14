import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ChildrenModule } from './children/children.module';
import { GrowthModule } from './growth/growth.module';
import { NutritionModule } from './nutrition/nutrition.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { AdvisorsModule } from './advisors/advisors.module';
import { TipsModule } from './tips/tips.module';
import { User } from './database/entities/user.entity';
import { Child } from './database/entities/child.entity';
import { AdvisorAvailability } from './database/entities/advisor-availability.entity';
import { GrowthTracking } from './database/entities/growth-tracking.entity';
import { NutritionPlan } from './database/entities/nutrition-plan.entity';
import { Appointment } from './database/entities/appointment.entity';
import { Tip } from './database/entities/tip.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [
        User, Child, AdvisorAvailability, GrowthTracking, NutritionPlan,
        Appointment, Tip,
      ],
      synchronize: process.env.NODE_ENV === 'development',
      logging: process.env.NODE_ENV === 'development',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: parseInt(process.env.THROTTLE_TTL, 10) || 60000,
        limit: parseInt(process.env.THROTTLE_LIMIT, 10) || 100,
      },
    ]),
    AuthModule,
    UsersModule,
    ChildrenModule,
    GrowthModule,
    NutritionModule,
    AppointmentsModule,
    AdvisorsModule,
    TipsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
