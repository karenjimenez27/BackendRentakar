import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Administrador, AdministradorRelations, Asesor, Vehiculo} from '../models';
import {AsesorRepository} from './asesor.repository';
import {VehiculoRepository} from './vehiculo.repository';

export class AdministradorRepository extends DefaultCrudRepository<
  Administrador,
  typeof Administrador.prototype.id,
  AdministradorRelations
> {

  public readonly asesors: HasManyRepositoryFactory<Asesor, typeof Administrador.prototype.id>;

  public readonly vehiculos: HasManyRepositoryFactory<Vehiculo, typeof Administrador.prototype.id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('AsesorRepository') protected asesorRepositoryGetter: Getter<AsesorRepository>, @repository.getter('VehiculoRepository') protected vehiculoRepositoryGetter: Getter<VehiculoRepository>,
  ) {
    super(Administrador, dataSource);
    this.vehiculos = this.createHasManyRepositoryFactoryFor('vehiculos', vehiculoRepositoryGetter,);
    this.registerInclusionResolver('vehiculos', this.vehiculos.inclusionResolver);
    this.asesors = this.createHasManyRepositoryFactoryFor('asesors', asesorRepositoryGetter,);
    this.registerInclusionResolver('asesors', this.asesors.inclusionResolver);
  }
}
