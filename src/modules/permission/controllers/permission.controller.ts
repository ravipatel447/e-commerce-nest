import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PermissionsEnum } from 'src/constants';
import { RequirePermissions } from 'src/decorators/requirePermission.decorator';
import { UpdateRolePermissionDto } from '../Dtos';
import { CreatePermissionDto } from '../Dtos/create-permission.dto';
import { PermissionService } from '../services/permission.service';

@Controller('permission')
@ApiBadRequestResponse({ description: 'Bad Request' })
@ApiTags('Permission')
export class PermissionController {
  constructor(private permissionServie: PermissionService) {}

  @Post()
  @RequirePermissions(PermissionsEnum.Permission, 'create')
  @ApiCreatedResponse({ description: 'permission created successfully' })
  createPermission(@Body() body: CreatePermissionDto) {
    return this.permissionServie.createPermission(body.permissionName);
  }

  @Get()
  @ApiAcceptedResponse({ description: 'permisssion fetched successfully' })
  @RequirePermissions(PermissionsEnum.Permission, 'read')
  findAllPermissions() {
    return this.permissionServie.findAllPermissions();
  }

  @Put(':permissionId')
  @ApiAcceptedResponse({ description: 'permisssionName updated successfully' })
  @RequirePermissions(PermissionsEnum.Permission, 'update')
  updatePermission(
    @Param('permissionId', ParseIntPipe) pid: number,
    @Body() body: CreatePermissionDto,
  ) {
    return this.permissionServie.updatePermission(pid, body.permissionName);
  }

  @Delete(':permissionId')
  @ApiAcceptedResponse({ description: 'permisssionName deleted successfully' })
  @RequirePermissions(PermissionsEnum.Permission, 'delete')
  deletePermission(@Param('permissionId', ParseIntPipe) pid: number) {
    return this.permissionServie.deletePermission(pid);
  }

  @Get('rolePermissions')
  @ApiAcceptedResponse({ description: 'role permisssion fetched successfully' })
  @RequirePermissions(PermissionsEnum.Permission, 'read')
  getAllrolePermission() {
    return this.permissionServie.findAllRolePermission();
  }

  @Patch('rolePermission')
  @ApiAcceptedResponse({
    description: 'role permisssion hasbeen updated successfully',
  })
  @RequirePermissions(PermissionsEnum.Permission, 'update')
  updateRolePermission(
    @Body()
    {
      roleId,
      permissionId,
      create,
      read,
      update,
      delete: d,
    }: UpdateRolePermissionDto,
  ) {
    return this.permissionServie.updateRolePermission(roleId, permissionId, {
      create,
      read,
      update,
      delete: d,
    });
  }
}
