import { Controller, Get } from '@nestjs/common';
import { ArticleService } from './article.service';

@Controller('/articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  findAll() {
    return this.articleService.findAll();
  }
}
