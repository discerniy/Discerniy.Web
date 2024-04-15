import { Injectable } from '@angular/core';
import { BaseApi } from './base-api';
import { GroupResponse } from '../models/responses/group-response';
import { Group } from '../models/data/Group';
import { PageResponse } from '../models/responses/page-response';
import { ClientResponse } from '../models/responses/client-response';
import { ClientStatus, ClientType } from '../models/data/Client';

@Injectable({
  providedIn: 'root'
})
export class GroupApiService extends BaseApi{
  public override get apiUrl(): string {
    return '/group';
  }

  constructor() {
    super();
  }

  getGroup(id: string) {
    return this.toDataResponse(this.get<GroupResponse>(id));
  }

  getMyGroups() {
    return this.toDataResponse(this.get<GroupResponse[]>('my'));
  }

  getAllGroups(options: GroupListRequest) {
    var url = `?Page=${options.page}&Limit=${options.limit}&AccessLevel=${options.accessLevel || ''}&Name=${options.name || ''}`;
    return this.toDataResponse(this.get<PageResponse<GroupResponse>>(url));
  }

  getMembers(groupId: string, options: GroupMembersRequest) {
    var url = `${groupId}/members?Page=${options.page}&Limit=${options.limit}&`+
              `FirstName=${options.firstName || ''}&LastName=${options.lastName || ''}&`+
              `Nickname=${options.nickname || ''}&Email=${options.email || ''}&`+
              `TaxPayerId=${options.taxPayerId || ''}&AccessLevel=${options.accessLevel || ''}&`+
              `Type=${options.type || ''}&Status=${options.status || ''}`;
    return this.toDataResponse(this.get<PageResponse<ClientResponse>>(url));
  }

  addMember(groupId: string, clientId: string) {
    return this.toDataResponse(this.post<ClientResponse>(`${groupId}/members/${clientId}`, {}));
  }

  deleteMember(groupId: string, clientId: string) {
    return this.toDataResponse(this.delete<ClientResponse>(`${groupId}/members/${clientId}`));
  }

  create(group: Group) {
    return this.toDataResponse(this.post<GroupResponse>('', group));
  }

  update(group: UpdateGroupRequest) {
    return this.toDataResponse(this.put<GroupResponse>(group.id, group));
  }

  remove(id: string) {
    return this.toDataResponse(this.delete<GroupResponse>(id));
  }
}

type UpdateGroupRequest = {
  id: string;
  name: string;
  description: string;
  accessLevel: number;
};

type GroupListRequest = {
  page: number;
  limit: number;
  name: string | undefined;
  accessLevel: number | undefined;
};

type GroupMembersRequest = {
  page: number;
  limit: number;
  firstName: string | undefined;
  lastName: string | undefined;
  nickname: string | undefined;
  email: string | undefined;
  taxPayerId: string | undefined;
  accessLevel: number | undefined;
  type: ClientType | undefined;
  status: ClientStatus | undefined;
};
