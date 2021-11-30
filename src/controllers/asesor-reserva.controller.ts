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
  Asesor,
  Reserva,
} from '../models';
import {AsesorRepository} from '../repositories';

export class AsesorReservaController {
  constructor(
    @repository(AsesorRepository) protected asesorRepository: AsesorRepository,
  ) { }

  @get('/asesors/{id}/reservas', {
    responses: {
      '200': {
        description: 'Array of Asesor has many Reserva',
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
    return this.asesorRepository.reservas(id).find(filter);
  }

  @post('/asesors/{id}/reservas', {
    responses: {
      '200': {
        description: 'Asesor model instance',
        content: {'application/json': {schema: getModelSchemaRef(Reserva)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Asesor.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Reserva, {
            title: 'NewReservaInAsesor',
            exclude: ['id'],
            optional: ['asesorId']
          }),
        },
      },
    }) reserva: Omit<Reserva, 'id'>,
  ): Promise<Reserva> {
    return this.asesorRepository.reservas(id).create(reserva);
  }

  @patch('/asesors/{id}/reservas', {
    responses: {
      '200': {
        description: 'Asesor.Reserva PATCH success count',
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
    return this.asesorRepository.reservas(id).patch(reserva, where);
  }

  @del('/asesors/{id}/reservas', {
    responses: {
      '200': {
        description: 'Asesor.Reserva DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Reserva)) where?: Where<Reserva>,
  ): Promise<Count> {
    return this.asesorRepository.reservas(id).delete(where);
  }
}
