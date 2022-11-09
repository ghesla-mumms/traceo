import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsNumber, IsEnum, IsOptional } from "class-validator";
import { MemberRole } from "../enums/amr.enum";

export class AddAccountToApplicationDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    accountId: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    applicationId: number;

    @IsEnum(MemberRole)
    @IsNotEmpty()
    @ApiProperty()
    role: MemberRole;
}

export class UpdateAmrDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    memberId: string;

    @IsEnum(MemberRole)
    @IsOptional()
    @ApiProperty()
    role: MemberRole;
}
