import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { FindAllDto } from 'src/common/dto/findAll.dto';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Roles } from 'src/common/guards/role.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';

@Controller('media')
@ApiBearerAuth('token')
@UseGuards(RoleGuard)
@UseGuards(AuthGuard)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @Roles('admin')
  create(@Body() createMediaDto: CreateMediaDto) {
    return this.mediaService.create(createMediaDto);
  }

  @Get()
  @Roles('admin')
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'search', required: false }) 
  findAll(@Query() findAllDto: FindAllDto) {
    return this.mediaService.findAll(findAllDto);
  }

  @Get(':id')
  @Roles('admin')
  findOne(@Param('id') id: string) {
    return this.mediaService.findOne(+id);
  }

  @Patch()
  @Roles('admin')
  update(@Body() updateMediaDto: UpdateMediaDto) {
    return this.mediaService.update(updateMediaDto);
  }
  
  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.mediaService.remove(+id);
  }
}
