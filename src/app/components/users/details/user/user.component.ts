import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, User } from 'src/app/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  user!: User;
  loading = true;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const id = +params['id'] || -1;
      if (id > 0) {
        this.loadUser(id);
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  loadUser(id: number): void {
    this.loading = true;
    this.userService.getSingleUser(id).subscribe({
      next: (res : any) => {
        this.user = res.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/']); // fallback
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}