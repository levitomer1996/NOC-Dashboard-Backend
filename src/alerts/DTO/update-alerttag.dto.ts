import { PartialType } from '@nestjs/mapped-types';
import { CreateAlertTagDto } from './create-alerttag.dto';

export class UpdateAlertTagDto extends PartialType(CreateAlertTagDto) { }
