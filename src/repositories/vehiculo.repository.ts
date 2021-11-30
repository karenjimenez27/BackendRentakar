import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Vehiculo, VehiculoRelations, Reserva, Administrador} from '../models';
import {ReservaRepository} from './reserva.repository';
import {AdministradorRepository} from './administrador.repository';

export class VehiculoRepository extends DefaultCrudRepository<
  Vehiculo,
  typeof Vehiculo.prototype.id,
  VehiculoRelations
> {

  public readonly reservas: HasManyRepositoryFactory<Reserva, typeof Vehiculo.prototype.id>;

  public readonly administradors: HasManyRepositoryFactory<Administrador, typeof Vehiculo.prototype.id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('ReservaRepository') protected reservaRepositoryGetter: Getter<ReservaRepository>, @repository.getter('AdministradorRepository') protected administradorRepositoryGetter: Getter<AdministradorRepository>,
  ) {
    super(Vehiculo, dataSource);
    this.administradors = this.createHasManyRepositoryFactoryFor('administradors', administradorRepositoryGetter,);
    this.registerInclusionResolver('administradors', this.administradors.inclusionResolver);
    this.reservas = this.createHasManyRepositoryFactoryFor('reservas', reservaRepositoryGetter,);
    this.registerInclusionResolver('reservas', this.reservas.inclusionResolver);
  }
}
