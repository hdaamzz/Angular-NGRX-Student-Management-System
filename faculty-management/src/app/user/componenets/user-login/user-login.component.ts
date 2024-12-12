import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { User, UserAuthService } from '../../../admin/service/user-auth.service';
import { isPlatformBrowser } from '@angular/common';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  providers:[provideAnimations()],
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.css'
})
export class UserLoginComponent implements OnInit {
  userLoginData!: FormGroup;
  returnUrl: string = '/user/user-dashboard';

  constructor(
    private fb: FormBuilder, 
    private route: ActivatedRoute, 
    private userAuthService: UserAuthService, 
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private toastr:ToastrService
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (this.userAuthService.isUserloggedIn()) {
        this.router.navigate([this.returnUrl]);
        return;
      }

      this.route.queryParams.subscribe(params => {
        if (params['registered'] === 'true') {

          this.toastr.success('Registration successful! Please log in.',"Created");
        }
      });

     
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/user/user-dashboard';
    }

    
    this.userLoginData = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  userLogin() {
    if (this.userLoginData.invalid) {
      this.toastr.info('Please fill in all fields correctly.');
      return;
    }

    const user: User = {
      username: this.userLoginData.value.username || '',
      password: this.userLoginData.value.password || ''
    };

    this.userAuthService.login(user).subscribe({
      next: (response) => {
       
        if (isPlatformBrowser(this.platformId)) {
          this.userAuthService.setLoggedIn(true);
          localStorage.setItem('authToken', response.token);
          
         
          this.router.navigateByUrl(this.returnUrl);
        }
      },
      error: (err) => {
        this.toastr.error('Invalid username or password. Please try again.',"Wrong Crediantial");
        console.error(err);
      }
    });
  }
}