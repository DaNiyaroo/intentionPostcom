import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { FindAllDto } from 'src/common/dto/findAll.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Roles } from 'src/common/guards/role.decorator';
import { RoleGuard } from 'src/common/guards/role.guard';

@Controller('user')
@ApiBearerAuth('token')
@UseGuards(RoleGuard)
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @Roles('admin', 'user')
  getMe(@Req() req: RequestWithUser) {
    return this.userService.getMe(req);
  }
  
  @Post()
  @Roles('admin')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Roles('admin')
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'search', required: false }) 
  findAll(@Query() findAllDto: FindAllDto) {
    return this.userService.findAll(findAllDto);
  }

  @Get(':id')
  @Roles('admin')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @Roles('admin','user')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @Roles('admin','user')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }  
}
