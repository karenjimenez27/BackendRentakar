import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Administrador, Asesor, Cliente} from '../models';
import {AdministradorRepository, AsesorRepository, ClienteRepository} from '../repositories';
import { Llaves } from '../config/llaves';

const generator = require("password-generator");
const cryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

@injectable({scope: BindingScope.TRANSIENT})
export class AutenticacionService {
  constructor(
    @repository(AdministradorRepository)
    public administradorRepository: AdministradorRepository,

    @repository(AsesorRepository)
    public asesorRepository: AsesorRepository,

    @repository(ClienteRepository)
    public clienteRepository: ClienteRepository

  ) { }

  /*
   * Add service methods here
   */

  GenerarClave() {
    let clave = generator(8, false);
    return clave;
  }

  CifrarClave(clave: string) {
    let claveCifrada = cryptoJS.MD5(clave).toString();
    return claveCifrada;
  }

  IdentificarAdministrdor(usuario: string, clave: string){
    try{
      let p= this.administradorRepository.findOne({where: {correo: usuario, clave: clave}})
      if(p){
        return p
      }
      return false;
    }catch{
      return false;
    }
  }

  IdentificarAsesor(usuario: string, clave: string){
    try{
      let p= this.asesorRepository.findOne({where: {correo: usuario, clave: clave}})
      if(p){
        return p
      }
      return false;
    }catch{
      return false;
    }
  }

  IdentificarCliente(usuario: string, clave: string){
    try{
      let p= this.clienteRepository.findOne({where: {correo: usuario, clave: clave}})
      if(p){
        return p
      }
      return false;
    }catch{
      return false;
    }
  }

  GenerarTokenJWTAdmin(administrador: Administrador){
    let token = jwt.sign({
      data:{
        id: administrador.id,
        correo: administrador.correo,
        nombre: administrador.nombre + " "+ administrador.apellido
      }
    },
    Llaves.claveJWT)
  }

  GenerarTokenJWTAsesor(asesor: Asesor){
    let token = jwt.sign({
      data:{
        id: asesor.id,
        correo: asesor.correo,
        nombre: asesor.nombre + " "+ asesor.apellido
      }
    },
    Llaves.claveJWT)
  }

  GenerarTokenJWTCliente(cliente: Cliente){
    let token = jwt.sign({
      data:{
        id: cliente.id,
        correo: cliente.correo,
        nombre: cliente.nombre + " "+ cliente.apellido
      }
    },
    Llaves.claveJWT)
  }
}
