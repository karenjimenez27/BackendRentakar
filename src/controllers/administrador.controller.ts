import {service} from '@loopback/core';

import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, HttpErrors, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
//import fetch from 'node-fetch';
import {Llaves} from '../config/llaves';
import {Administrador, Credenciales} from '../models';
import {AdministradorRepository} from '../repositories';
import {AutenticacionService} from '../services/autenticacion.service';
const fetch = require('node-fetch');


export class AdministradorController {
  constructor(
    @repository(AdministradorRepository)
    public administradorRepository: AdministradorRepository,
    @service(AutenticacionService)
    public servicioAutenticacion: AutenticacionService
  ) { }

  @post("/identificarAdministrador", {
    responses:{
      '200':{
        description:"Identificación de usuarios"
      }
    }
  })
  async identificarAdministrador(
    @requestBody() credenciales:Credenciales
  ){
    let ad = await this.servicioAutenticacion.IdentificarAdministrador(credenciales.usuario, credenciales.clave);
    if(ad) {
      let token = this.servicioAutenticacion.GenerarTokenJWTAdmin(ad);
      return{
        datos: {
          nombre: ad.nombre,
          correo: ad.correo,
          id: ad.id
        },
        tk: token
      }

    }else{
      throw new HttpErrors[401]("Datos inválidos");
    }

  }

  @post('/administradors')
  @response(200, {
    description: 'Administrador model instance',
    content: {'application/json': {schema: getModelSchemaRef(Administrador)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Administrador, {
            title: 'NewAdministrador',
            exclude: ['id'],
          }),
        },
      },
    })
    administrador: Omit<Administrador, 'id'>,
  ): Promise<Administrador> {

    let clave = this.servicioAutenticacion.GenerarClave();
    let claveCifrada = this.servicioAutenticacion.CifrarClave(clave);
    administrador.clave = claveCifrada;
    let p = await this.administradorRepository.create(administrador);

    //Notificar Al Usuario
    let destino = administrador.correo;
    let asunto = 'Registro en la plataforma';
    let contenido = `Hola ${administrador.nombre}, su nombre de usuario es: ${administrador.correo}, y su contraseña es: ${administrador.clave};`
    fetch(`${Llaves.urlServicioNotificaciones}/envio_correos?correo_destino=${destino}&asunto=${asunto}&contenido=${contenido}`)
    .then((data:any)=>{
      console.log(data);
    })
    return p;
  }

  @get('/administradors/count')
  @response(200, {
    description: 'Administrador model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Administrador) where?: Where<Administrador>,
  ): Promise<Count> {
    return this.administradorRepository.count(where);
  }

  @get('/administradors')
  @response(200, {
    description: 'Array of Administrador model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Administrador, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Administrador) filter?: Filter<Administrador>,
  ): Promise<Administrador[]> {
    return this.administradorRepository.find(filter);
  }

  @patch('/administradors')
  @response(200, {
    description: 'Administrador PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Administrador, {partial: true}),
        },
      },
    })
    administrador: Administrador,
    @param.where(Administrador) where?: Where<Administrador>,
  ): Promise<Count> {
    return this.administradorRepository.updateAll(administrador, where);
  }

  @get('/administradors/{id}')
  @response(200, {
    description: 'Administrador model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Administrador, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Administrador, {exclude: 'where'}) filter?: FilterExcludingWhere<Administrador>
  ): Promise<Administrador> {
    return this.administradorRepository.findById(id, filter);
  }

  @patch('/administradors/{id}')
  @response(204, {
    description: 'Administrador PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Administrador, {partial: true}),
        },
      },
    })
    administrador: Administrador,
  ): Promise<void> {
    await this.administradorRepository.updateById(id, administrador);
  }

  @put('/administradors/{id}')
  @response(204, {
    description: 'Administrador PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() administrador: Administrador,
  ): Promise<void> {
    await this.administradorRepository.replaceById(id, administrador);
  }

  @del('/administradors/{id}')
  @response(204, {
    description: 'Administrador DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.administradorRepository.deleteById(id);
  }
}
