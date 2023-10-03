export interface ConexionPosUserInterface {
    user: string;
    password: string;
}

export interface SigninInterface {
    uuid: string;
    email: string;
    password: string;
    userType: string;
}

export interface LoginInterface {
    email: string;
    password: string;
}