import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Reserva,
  Asesor,
} from '../models';
import {ReservaRepository} from '../repositories';

export class ReservaAsesorController {
  constructor(
    @repository(ReservaRepository)
    public reservaRepository: ReservaRepository,
  ) { }

  @get('/reservas/{id}/asesor', {
    responses: {
      '200': {
        description: 'Asesor belonging to Reserva',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Asesor)},
          },
        },
      },
    },
  })
  async getAsesor(
    @param.path.string('id') id: typeof Reserva.prototype.id,
  ): Promise<Asesor> {
    return this.reservaRepository.asesor(id);
  }
}
