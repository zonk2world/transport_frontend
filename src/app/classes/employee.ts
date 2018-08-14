export class Employee {
    uid: string;
    network: string;
    role: string;
    name: string;
    password: string;
    phone: string;
    surname: string;
    username: string;
    picture: string;

    constructor(uid: string = '', network: string = '', role: string = 'Enforcer',
                name: string = '', password: string = '',
                phone: string = '', surname: string = '', username: string = '', picture: string = '')
      {
        this.uid = uid;
        this.network = network;
        this.role = role;
        this.name = name;
        this.password = password;
        this.phone = phone;
        this.surname = surname;
        this.username = username;
        this.picture = picture;
    }
}
