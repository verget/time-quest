import { InMemoryDbService } from 'angular-in-memory-web-api';

export class FakeDataService implements InMemoryDbService {
  createDb() {
    const users = [
      { id: 0,
        name: 'Zero',
        endTime: '149908496300'
      }
    ];
    return {users};
  }
}
