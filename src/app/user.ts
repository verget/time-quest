export class User {
  uid: string;
  name: string;
  email: string;
  role: string;
  endTime: number;
  formatedEndTime?: string;
  usedCodes: Object;
  notificationTokens: Object;
}
