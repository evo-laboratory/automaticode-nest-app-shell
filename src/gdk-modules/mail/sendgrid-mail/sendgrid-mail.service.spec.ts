import { Test, TestingModule } from '@nestjs/testing';
import { SendgridMailService } from './sendgrid-mail.service';

describe('SendgridMailService', () => {
  let service: SendgridMailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SendgridMailService],
    }).compile();

    service = module.get<SendgridMailService>(SendgridMailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
