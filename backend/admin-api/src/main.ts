import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('B2B Chatbot Platform API')
    .setDescription('Admin API for managing chatbots, conversations, and analytics')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document)

  const port = process.env.PORT || 4000
  await app.listen(port)
  
  console.log(`🚀 Admin API is running on: http://localhost:${port}`)
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`)
}

bootstrap()
