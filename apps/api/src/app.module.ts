import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { CustomersModule } from './modules/customers/customers.module';
import { RestaurantsModule } from './modules/restaurants/restaurants.module';
import { BranchesModule } from './modules/branches/branches.module';
import { TablesModule } from './modules/tables/tables.module';
import { StaffModule } from './modules/staff/staff.module';
import { RolesModule } from './modules/roles/roles.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { OffersModule } from './modules/offers/offers.module';
import { LoyaltyModule } from './modules/loyalty/loyalty.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { ReportsModule } from './modules/reports/reports.module';
import { WifiModule } from './modules/wifi/wifi.module';
import { GamesModule } from './modules/games/games.module';
import { ArModule } from './modules/ar/ar.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { WaiterModule } from './modules/waiter/waiter.module';
import { CashierModule } from './modules/cashier/cashier.module';
import { KitchenModule } from './modules/kitchen/kitchen.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    CustomersModule,
    RestaurantsModule,
    BranchesModule,
    TablesModule,
    StaffModule,
    RolesModule,
    PermissionsModule,
    InventoryModule,
    PaymentsModule,
    ReviewsModule,
    OffersModule,
    LoyaltyModule,
    NotificationsModule,
    AnalyticsModule,
    ReportsModule,
    WifiModule,
    GamesModule,
    ArModule,
    UploadsModule,
    WaiterModule,
    CashierModule,
    KitchenModule,
  ],
})
export class AppModule {}