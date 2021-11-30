import {Entity, model, property, belongsTo, hasOne} from '@loopback/repository';
import {Cliente} from './cliente.model';
import {Asesor} from './asesor.model';
import {Vehiculo} from './vehiculo.model';

@model({settings: {strict: false}})
export class Reserva extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  id_vehiculo: string;

  @property({
    type: 'string',
    required: true,
  })
  id_cliente: string;

  @property({
    type: 'date',
    required: true,
  })
  fechaSolicitud: string;

  @property({
    type: 'string',
    required: true,
  })
  estado: string;

  @belongsTo(() => Cliente)
  clienteId: string;

  @belongsTo(() => Asesor)
  asesorId: string;

  @hasOne(() => Vehiculo)
  vehiculo: Vehiculo;

  @property({
    type: 'string',
  })
  vehiculoId?: string;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Reserva>) {
    super(data);
  }
}

export interface ReservaRelations {
  // describe navigational properties here
}

export type ReservaWithRelations = Reserva & ReservaRelations;
