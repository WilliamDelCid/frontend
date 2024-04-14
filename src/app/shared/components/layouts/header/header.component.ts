import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TokenService } from '../../../../core/services/token.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(public tokenService: TokenService) {}


  hasRole(role: string): boolean {
    return this.tokenService.getRoles().includes(role);
  }
  cerrarSesion(){
    return this.tokenService.logOut();
  }
}
