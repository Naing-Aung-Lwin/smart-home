import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Menu, MenuSchema } from './schemas/menu.schema';
import { Curry, CurrySchema } from 'src/curry/schemas/curry.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Menu.name, schema: MenuSchema },
      { name: Curry.name, schema: CurrySchema },
    ]),
  ],
  providers: [MenuService],
  controllers: [MenuController],
})
export class MenuModule {}
