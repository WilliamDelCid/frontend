import { Component, inject } from '@angular/core';
import { LoginUsuario } from '../../core/models/login-usuario';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TokenService } from '../../core/services/token.service';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginUsuario!: LoginUsuario;
  toggleBtn: boolean = false;

  formularioLogin!: FormGroup;

  private fb = inject(FormBuilder);
  private tokenService = inject(TokenService);
  private authService = inject(AuthService);
  private router = inject(Router);
  ngOnInit(): void {
    this.formularioLogin = this.iniciarFormulario();
  }

  seePassword() {
    this.toggleBtn = !this.toggleBtn;
  }

  private iniciarFormulario(): FormGroup {
    return this.fb.group({
      usuario: ['', [Validators.required]],
      contrasenia: ['', [Validators.required]],
    });
  }

  onLogin(): void {
    this.loginUsuario = new LoginUsuario(
      this.formularioLogin.get('usuario')?.value,
      this.formularioLogin.get('contrasenia')?.value,
    );

    this.authService.login(this.loginUsuario).subscribe({
      next: (data) => {
        this.tokenService.setToken(data.token);

        this.router.navigate(['/inicio']);
      },
      error: () => {
        Swal.fire({
          title: 'Datos Incorrectos',
          text: 'Vuelve a intentarlo',
          showConfirmButton: false,
          timer: 1500,
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
        });
      },
    });
  }
}
