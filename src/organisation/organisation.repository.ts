import { EntityRepository, Repository } from 'typeorm';
import { Organisation } from './entities/organisation.entity';

@EntityRepository(Organisation)
export class OrganisationRepo extends Repository<Organisation> {
  
}
