export enum PermissionGroup {
  MANAGER = "manager",
  EMPLOYER = "employer",
}

export enum PermissionGroupTag {
  manager = "Amministratore",
  employer = "Responsabile",
}

export interface SmallUser {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
}

export interface UserInfoModel {
  first_name: string;
  last_name: string;
  phone_number: string;
}

export interface UserModel {
  id: number;
  last_login: Date;
  is_superuser: boolean;
  is_staff: boolean;
  is_active: boolean;
  email: string;
  groups: Array<PermissionGroup>;
  user_permissions: Array<any>;
  updated_at: Date;
  user_info: UserInfoModel | null;
}


// [Next  ] {
//   [Next  ]   expiry: '2024-05-10T15:25:23.186913Z',
//   [Next  ]   token: '9cd7320a2ad8f06fb3025c0f47d3c5b592e3b5a019c5369a1c32e16a2eab41d9',
//   [Next  ]   user: {
//   [Next  ]     id: 1,
//   [Next  ]     user_info: {
//   [Next  ]       id: 1,
//   [Next  ]       first_name: 'Andrea',
//   [Next  ]       last_name: 'Bellomia',
//   [Next  ]       phone_number: '3395498167312'
//   [Next  ]     },
//   [Next  ]     groups: [ 'manager' ],
//   [Next  ]     last_login: '2024-05-08T15:25:23.190535Z',
//   [Next  ]     is_superuser: true,
//   [Next  ]     is_staff: true,
//   [Next  ]     is_active: true,
//   [Next  ]     date_joined: '2024-04-11T15:33:47Z',
//   [Next  ]     created_at: '2024-04-11T15:33:47.626084Z',
//   [Next  ]     updated_at: '2024-04-29T17:09:55.134585Z',
//   [Next  ]     email: 'admin@admin.it',
//   [Next  ]     user_permissions: []
//   [Next  ]   }
//   [Next  ] }