import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Vehiculo,
  Administrador,
} from '../models';
import {VehiculoRepository} from '../repositories';

export class VehiculoAdministradorController {
  constructor(
    @repository(VehiculoRepository) protected vehiculoRepository: VehiculoRepository,
  ) { }

  @get('/vehiculos/{id}/administradors', {
    responses: {
      '200': {
        description: 'Array of Vehiculo has many Administrador',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Administrador)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Administrador>,
  ): Promise<Administrador[]> {
    return this.vehiculoRepository.administradors(id).find(filter);
  }

  @post('/vehiculos/{id}/administradors', {
    responses: {
      '200': {
        description: 'Vehiculo model instance',
        content: {'application/json': {schema: getModelSchemaRef(Administrador)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Vehiculo.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Administrador, {
            title: 'NewAdministradorInVehiculo',
            exclude: ['id'],
            optional: ['vehiculoId']
          }),
        },
      },
    }) administrador: Omit<Administrador, 'id'>,
  ): Promise<Administrador> {
    return this.vehiculoRepository.administradors(id).create(administrador);
  }

  @patch('/vehiculos/{id}/administradors', {
    responses: {
      '200': {
        description: 'Vehiculo.Administrador PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Administrador, {partial: true}),
        },
      },
    })
    administrador: Partial<Administrador>,
    @param.query.object('where', getWhereSchemaFor(Administrador)) where?: Where<Administrador>,
  ): Promise<Count> {
    return this.vehiculoRepository.administradors(id).patch(administrador, where);
  }

  @del('/vehiculos/{id}/administradors', {
    responses: {
      '200': {
        description: 'Vehiculo.Administrador DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Administrador)) where?: Where<Administrador>,
  ): Promise<Count> {
    return this.vehiculoRepository.administradors(id).delete(where);
  }
}
