import { ServerData } from '../../ServerData'
import { User } from '../../userData/User';

export function getUser(serverData: ServerData, id: String): User {
    for (let i = 0; i < serverData.users.length; i++) {
        if (serverData.users[i].Id == id) {
            return serverData.users[i];
        }
    }
    return null as any;
}