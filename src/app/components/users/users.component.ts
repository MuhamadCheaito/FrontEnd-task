import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import {UserService,User} from '../../services/user.service';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})

export class UsersComponent implements OnInit {
  users: User[] = [];
  currentPage = 1;
  totalPages = 0;
  loading = true;
  filteredUsers: User[] = [];
  searchQuery: string = "";
  searchResult: User | null = null;
  focusedUserId: number | null = null;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.currentPage = +params['page'] || 1;
      this.loadUsers(this.currentPage);
    });
  }

  loadUsers(page: number): void {
    this.loading = true;
    this.userService.getUsers(page).subscribe({
      next: (response) => {
        this.users = response.data;
        this.totalPages = response.total_pages;
        this.loading = false;
        this.filteredUsers = this.users
      },
      error: () => {
        this.loading = false;
        this.users = [];
        this.filteredUsers = [];
      }
    });
  }

  onSearchById(): void {
    const userId = parseInt(this.searchQuery, 10);
    if (userId && !isNaN(userId)) {
      const user = this.users.find(u => u.id === userId);
      if (user) {
        this.searchResult = user;
        this.focusedUserId = user.id; // Set the focused user ID
      } else {
        this.searchResult = null;
        this.focusedUserId = null; // Reset focused user ID if not found
      }
    } else {
      this.searchResult = null;
      this.focusedUserId = null; // Reset focused user ID if search query is empty
    }
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.router.navigate([], {
        queryParams: { page },
        queryParamsHandling: 'merge'
      });
    }
  }
  goToUser(id: number): void {
    this.router.navigate(['/user'], {
      queryParams: { id }
    });
  }
  
}
