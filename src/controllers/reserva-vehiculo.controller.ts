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
  Reserva,
  Vehiculo,
} from '../models';
import {ReservaRepository} from '../repositories';

export class ReservaVehiculoController {
  constructor(
    @repository(ReservaRepository) protected reservaRepository: ReservaRepository,
  ) { }

  @get('/reservas/{id}/vehiculo', {
    responses: {
      '200': {
        description: 'Reserva has one Vehiculo',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Vehiculo),
          },
        },
      },
    },
  })
  async get(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Vehiculo>,
  ): Promise<Vehiculo> {
    return this.reservaRepository.vehiculo(id).get(filter);
  }

  @post('/reservas/{id}/vehiculo', {
    responses: {
      '200': {
        description: 'Reserva model instance',
        content: {'application/json': {schema: getModelSchemaRef(Vehiculo)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Reserva.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Vehiculo, {
            title: 'NewVehiculoInReserva',
            exclude: ['id'],
            optional: ['reservaId']
          }),
        },
      },
    }) vehiculo: Omit<Vehiculo, 'id'>,
  ): Promise<Vehiculo> {
    return this.reservaRepository.vehiculo(id).create(vehiculo);
  }

  @patch('/reservas/{id}/vehiculo', {
    responses: {
      '200': {
        description: 'Reserva.Vehiculo PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Vehiculo, {partial: true}),
        },
      },
    })
    vehiculo: Partial<Vehiculo>,
    @param.query.object('where', getWhereSchemaFor(Vehiculo)) where?: Where<Vehiculo>,
  ): Promise<Count> {
    return this.reservaRepository.vehiculo(id).patch(vehiculo, where);
  }

  @del('/reservas/{id}/vehiculo', {
    responses: {
      '200': {
        description: 'Reserva.Vehiculo DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Vehiculo)) where?: Where<Vehiculo>,
  ): Promise<Count> {
    return this.reservaRepository.vehiculo(id).delete(where);
  }
}
