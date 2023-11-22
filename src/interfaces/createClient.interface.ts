export interface IcreateClient {

    nit: string;
    nombres: string;
    nomcomercial?: string;
    apellidos?:string;
    direccion: string;
    telefono: string;
    email?: string;
    estado: boolean;
    cliente: number;
    tipopersona: number;
    idregimen: number;
    tipofactura: number;
    TipoId: number;
    idpais: number;
    iddepto: number;
    idmunicipio: number;
    idbarrio: number;
}

export interface INeighborhoodsInterface {
    nombarrio: string;
    codzona: number;
    idmunicipio: number;
}
