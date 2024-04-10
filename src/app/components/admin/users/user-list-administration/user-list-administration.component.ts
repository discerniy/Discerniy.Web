import { Component, OnInit } from '@angular/core';
import { SearchFilter, TableColumn, TableRecord } from '../../../table/table.component';
import { Router } from '@angular/router';
import { UserApiService } from 'src/app/services/user-api.service';
import { ClientStatus } from 'src/app/models/data/Client';

@Component({
  selector: 'app-user-list-administration',
  templateUrl: './user-list-administration.component.html',
  styleUrls: ['./user-list-administration.component.css']
})
export class UserListAdministrationComponent implements OnInit {
  public page: number = 1;
  public limit: number = 10;
  public columns: TableColumn[] = [
    { name: 'models.user.firstName', type: 'string' },
    { name: 'models.user.lastName', type: 'string' },
    { name: 'models.user.nickname', type: 'string' },
    { name: 'models.user.email', type: 'string' },
    { name: 'models.user.taxPayerId', type: 'string' },
    { name: 'models.client.status', type: 'string', translate: true }
  ];

  public searchFilters: SearchFilter[] = [
    { column: 'models.user.firstName', type: 'string', value: '' },
    { column: 'models.user.lastName', type: 'string', value: '' },
    { column: 'models.user.email', type: 'string', value: '' },
    { column: 'models.user.taxPayerId', type: 'string', value: '' },
    {
      column: 'models.client.status', type: 'select', value: -1, selectOptions: [
        { value: -1, label: 'models.clientStatuses.any', selected: true },
        { value: ClientStatus.Active, label: 'models.clientStatuses.active' },
        { value: ClientStatus.Inactive, label: 'models.clientStatuses.inactive' },
        { value: ClientStatus.Limited, label: 'models.clientStatuses.limited' },
        { value: ClientStatus.Banned, label: 'models.clientStatuses.banned' }
      ]
    }
  ];

  public data: TableRecord[] = [];

  constructor(private router: Router, private userApi: UserApiService) { }
  ngOnInit(): void {
    this.load();
  }

  public onViewInfo(id: string) {
    this.router.navigate(['/home/admin/users', id]);
  }

  public onSearch(filters: SearchFilter[]) {
    console.log(this.searchFilters);
    this.load();
  }

  public load() {
    let status: number | undefined = this.searchFilters.find(f => f.column == 'models.client.status')?.value as number;
    if (status == -1) {
      status = undefined;
    }
    let query = {
      page: this.page,
      limit: this.limit,
      firstName: this.searchFilters.find(f => f.column == 'models.user.firstName')?.value as string,
      lastName: this.searchFilters.find(f => f.column == 'models.user.lastName')?.value as string,
      email: this.searchFilters.find(f => f.column == 'models.user.email')?.value as string,
      taxPayerId: this.searchFilters.find(f => f.column == 'models.user.taxPayerId')?.value as string,
      status: status
    };
    this.userApi.getUsers(query).then(users => {
      this.data = users.items.map(user => {
        let status = 'models.clientStatuses.' + ClientStatus[user.status].toLowerCase();
        return {
          id: user.id,
          values: [user.firstName, user.lastName, user.nickname, user.email, user.taxPayerId, status]
        };
      });
    });
  }
}
