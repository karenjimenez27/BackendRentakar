import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasOneRepositoryFactory} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Reserva, ReservaRelations, Cliente, Asesor, Vehiculo} from '../models';
import {ClienteRepository} from './cliente.repository';
import {AsesorRepository} from './asesor.repository';
import {VehiculoRepository} from './vehiculo.repository';

export class ReservaRepository extends DefaultCrudRepository<
  Reserva,
  typeof Reserva.prototype.id,
  ReservaRelations
> {

  public readonly cliente: BelongsToAccessor<Cliente, typeof Reserva.prototype.id>;

  public readonly asesor: BelongsToAccessor<Asesor, typeof Reserva.prototype.id>;

  public readonly vehiculo: HasOneRepositoryFactory<Vehiculo, typeof Reserva.prototype.id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('ClienteRepository') protected clienteRepositoryGetter: Getter<ClienteRepository>, @repository.getter('AsesorRepository') protected asesorRepositoryGetter: Getter<AsesorRepository>, @repository.getter('VehiculoRepository') protected vehiculoRepositoryGetter: Getter<VehiculoRepository>,
  ) {
    super(Reserva, dataSource);
    this.vehiculo = this.createHasOneRepositoryFactoryFor('vehiculo', vehiculoRepositoryGetter);
    this.registerInclusionResolver('vehiculo', this.vehiculo.inclusionResolver);
    this.asesor = this.createBelongsToAccessorFor('asesor', asesorRepositoryGetter,);
    this.registerInclusionResolver('asesor', this.asesor.inclusionResolver);
    this.cliente = this.createBelongsToAccessorFor('cliente', clienteRepositoryGetter,);
    this.registerInclusionResolver('cliente', this.cliente.inclusionResolver);
  }
}
