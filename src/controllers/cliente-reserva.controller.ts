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
  Cliente,
  Reserva,
} from '../models';
import {ClienteRepository} from '../repositories';

export class ClienteReservaController {
  constructor(
    @repository(ClienteRepository) protected clienteRepository: ClienteRepository,
  ) { }

  @get('/clientes/{id}/reservas', {
    responses: {
      '200': {
        description: 'Array of Cliente has many Reserva',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Reserva)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Reserva>,
  ): Promise<Reserva[]> {
    return this.clienteRepository.reservas(id).find(filter);
  }

  @post('/clientes/{id}/reservas', {
    responses: {
      '200': {
        description: 'Cliente model instance',
        content: {'application/json': {schema: getModelSchemaRef(Reserva)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Cliente.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Reserva, {
            title: 'NewReservaInCliente',
            exclude: ['id'],
            optional: ['clienteId']
          }),
        },
      },
    }) reserva: Omit<Reserva, 'id'>,
  ): Promise<Reserva> {
    return this.clienteRepository.reservas(id).create(reserva);
  }

  @patch('/clientes/{id}/reservas', {
    responses: {
      '200': {
        description: 'Cliente.Reserva PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Reserva, {partial: true}),
        },
      },
    })
    reserva: Partial<Reserva>,
    @param.query.object('where', getWhereSchemaFor(Reserva)) where?: Where<Reserva>,
  ): Promise<Count> {
    return this.clienteRepository.reservas(id).patch(reserva, where);
  }

  @del('/clientes/{id}/reservas', {
    responses: {
      '200': {
        description: 'Cliente.Reserva DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Reserva)) where?: Where<Reserva>,
  ): Promise<Count> {
    return this.clienteRepository.reservas(id).delete(where);
  }
}
