export class NuevoUsuario {
  nombre: string;
  usuario: string;
  correo: string;
  contrasenia: string;
  constructor(nombre: string, usuario: string, correo: string, contrasenia: string) {
    this.nombre = nombre;
    this.usuario = usuario;
    this.correo = correo;
    this.contrasenia = contrasenia;
  }
}
