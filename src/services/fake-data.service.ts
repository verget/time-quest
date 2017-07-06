import { InMemoryDbService } from 'angular-in-memory-web-api';

export class FakeDataService implements InMemoryDbService {
  createDb() {
    const users = [
      { id: 0,
        name: 'Zero',
        endTime: '1499535221000'
      }
    ];
    const codes = [
      {
        string: "aaa",
        cost: 100000
      }
    ];
    return {users, codes};
  }
}
