import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Param,
  ParseUUIDPipe,
  Post,
  Res,
} from "@nestjs/common";
import { UserMetadataService } from "./user-metadata.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ResponseUserMetadataDto } from "./dto/user-metadata-response.dto";
import { UserMetadataFilterDto } from "./dto";
import { getPrismaErrorStatusAndMessage } from "src/utils/utils";

@Controller("user-metadata")
@ApiTags("user-metadata")
export class UserMetadataController {
  constructor(private readonly userMetadataService: UserMetadataService) {}
  private readonly logger = new Logger(UserMetadataController.name);

  @Post(":userId")
  @ApiOperation({ summary: "Create or Update User Metadata" })
  @ApiResponse({ status: HttpStatus.OK, type: ResponseUserMetadataDto })
  async createOrUpdateUserMetadata(
    @Res() res,
    @Param("userId", ParseUUIDPipe) userId: string
  ): Promise<ResponseUserMetadataDto> {
    try {
      this.logger.log(`Creating or Updating User Metadata`);

      const userMetadata =
        await this.userMetadataService.createOrUpdateUserMetadata(userId);

      this.logger.log(`Successfully created the new survey config.`);

      return res.status(HttpStatus.OK).json({
        message: "UserMetadata created or updated successfully",
        data: userMetadata,
      });
    } catch (error) {
      this.logger.error(`Failed to Create or Update User Metadata.`, error);

      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error);

      return res.status(statusCode).json({
        statusCode,
        message: errorMessage || `Failed to Create or Update User Metadata.`,
      });
    }
  }

  @Get(":userId")
  @ApiOperation({ summary: "Fetch User Metadata by userId" })
  @ApiResponse({ status: HttpStatus.FOUND, type: ResponseUserMetadataDto })
  async findUserMetadata(
    @Res() res,
    @Param("userId", ParseUUIDPipe) userId: string
  ): Promise<ResponseUserMetadataDto> {
    try {
      this.logger.log(`Fetching User Metadata`);

      const userMetadata = await this.userMetadataService.findUserMetadataById(
        userId
      );

      this.logger.log(`Successfully fetched UserMetadata for id #${userId}.`);

      return res.status(HttpStatus.OK).json({
        message: "UserMetadata fetched successfully",
        data: userMetadata,
      });
    } catch (error) {
      this.logger.error(
        `Failed to fetch UserMetadata for id #${userId}.`,
        error
      );

      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error);

      return res.status(statusCode).json({
        statusCode,
        message:
          errorMessage || `Failed to fetch UserMetadata for id #${userId}.`,
      });
    }
  }

  @Get()
  @ApiOperation({
    summary: "Fetch User Metadata accordind to the filter specified.",
  })
  @ApiResponse({
    status: HttpStatus.FOUND,
    type: ResponseUserMetadataDto,
    isArray: true,
  })
  async findManyUserMetadata(
    @Res() res,
    @Body() filter: UserMetadataFilterDto
  ): Promise<ResponseUserMetadataDto[]> {
    try {
      this.logger.log(`Fetching UserMetadata(s)`);

      const userMetadata = await this.userMetadataService.findManyUserMetadata(
        filter
      );

      this.logger.log(`Successfully fetched UserMetadata(s).`);

      return res.status(HttpStatus.OK).json({
        message: "UserMetadata(s) fetched successfully",
        data: userMetadata,
      });
    } catch (error) {
      this.logger.error(`Failed to fetch UserMetadats(s).`, error);

      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error);

      return res.status(statusCode).json({
        statusCode,
        message: errorMessage || `Failed to fetch UserMetadata(s).`,
      });
    }
  }

  @Delete(":userId")
  @ApiOperation({ summary: "Delete User Metadata." })
  @ApiResponse({ status: HttpStatus.OK, type: ResponseUserMetadataDto })
  async deleteUserMetadata(
    @Res() res,
    @Param("userId", ParseUUIDPipe) userId: string
  ): Promise<ResponseUserMetadataDto> {
    try {
      this.logger.log(`Deleting UserMetadata.`);

      const userMetadata = await this.userMetadataService.deleteUserMetadata(
        userId
      );

      this.logger.log(
        `Successfully deleted UserMetadata with userId ${userId}.`
      );

      return res.status(HttpStatus.OK).json({
        message: "UserMetadata deleted successfully",
        data: userMetadata,
      });
    } catch (error) {
      this.logger.error(`Failed to delete UserMetadata.`, error);

      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error);

      return res.status(statusCode).json({
        statusCode,
        message: errorMessage || `Failed to delete UserMetadata.`,
      });
    }
  }
}
