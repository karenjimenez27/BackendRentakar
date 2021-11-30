import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Cliente, ClienteRelations, Reserva} from '../models';
import {ReservaRepository} from './reserva.repository';

export class ClienteRepository extends DefaultCrudRepository<
  Cliente,
  typeof Cliente.prototype.id,
  ClienteRelations
> {

  public readonly reservas: HasManyRepositoryFactory<Reserva, typeof Cliente.prototype.id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('ReservaRepository') protected reservaRepositoryGetter: Getter<ReservaRepository>,
  ) {
    super(Cliente, dataSource);
    this.reservas = this.createHasManyRepositoryFactoryFor('reservas', reservaRepositoryGetter,);
    this.registerInclusionResolver('reservas', this.reservas.inclusionResolver);
  }
}
