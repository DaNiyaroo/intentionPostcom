import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from './common/config/typeorm.config';
import { PostModule } from './modules/post/post.module';
import { MediaModule } from './modules/media/media.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeormConfig), UserModule, AuthModule, PostModule, MediaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
