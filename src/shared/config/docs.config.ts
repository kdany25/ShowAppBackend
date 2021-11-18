import { DocumentBuilder } from "@nestjs/swagger"; 

export const config = new DocumentBuilder()
.setTitle('ShowApp')
.setDescription('ShowApp Documentation')
.build();